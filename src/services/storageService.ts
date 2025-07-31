import { supabase } from './supabase';
import { Database } from './supabase';

type MediaFile = Database['public']['Tables']['media_files']['Row'];
type MediaFileInsert = Database['public']['Tables']['media_files']['Insert'];
type MediaFileUpdate = Database['public']['Tables']['media_files']['Update'];

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
  fileId?: string;
}

export interface StorageConfig {
  bucket: 'media-files' | 'avatars' | 'charity-logos';
  folder?: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

const STORAGE_CONFIGS: Record<string, StorageConfig> = {
  'media-files': {
    bucket: 'media-files',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'],
  },
  'avatars': {
    bucket: 'avatars',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  },
  'charity-logos': {
    bucket: 'charity-logos',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  },
};

export class StorageService {
  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File | Blob,
    fileName: string,
    bucketType: keyof typeof STORAGE_CONFIGS,
    folder?: string
  ): Promise<UploadResult> {
    try {
      const config = STORAGE_CONFIGS[bucketType];
      
      if (!config) {
        return {
          success: false,
          error: 'Invalid bucket type',
        };
      }

      // Validate file size
      if (file.size > config.maxFileSize) {
        return {
          success: false,
          error: `File size exceeds maximum allowed size of ${config.maxFileSize / (1024 * 1024)}MB`,
        };
      }

      // Validate file type
      if (!config.allowedMimeTypes.includes(file.type)) {
        return {
          success: false,
          error: `File type ${file.type} is not allowed`,
        };
      }

      // Generate unique file name
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        fileUrl: urlData.publicUrl,
        fileId: data.path,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Upload media file and save to database
   */
  static async uploadMediaFile(
    file: File | Blob,
    fileName: string,
    orderId: string,
    uploadedBy: string,
    isPublic: boolean = false
  ): Promise<UploadResult> {
    try {
      const uploadResult = await this.uploadFile(file, fileName, 'media-files', orderId);
      
      if (!uploadResult.success || !uploadResult.fileUrl) {
        return uploadResult;
      }

      // Save to database
      const mediaFileData: MediaFileInsert = {
        order_id: orderId,
        file_name: fileName,
        file_url: uploadResult.fileUrl,
        file_type: file.type,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy,
        is_public: isPublic,
      };

      const { data, error } = await supabase
        .from('media_files')
        .insert(mediaFileData)
        .select()
        .single();

      if (error) {
        // Delete uploaded file if database insert fails
        await this.deleteFile(uploadResult.fileId!, 'media-files');
        
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        fileUrl: uploadResult.fileUrl,
        fileId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(
    file: File | Blob,
    fileName: string,
    userId: string
  ): Promise<UploadResult> {
    try {
      const uploadResult = await this.uploadFile(file, fileName, 'avatars', userId);
      
      if (!uploadResult.success || !uploadResult.fileUrl) {
        return uploadResult;
      }

      // Update user profile with avatar URL
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: uploadResult.fileUrl })
        .eq('user_id', userId);

      if (error) {
        // Delete uploaded file if database update fails
        await this.deleteFile(uploadResult.fileId!, 'avatars');
        
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        fileUrl: uploadResult.fileUrl,
        fileId: uploadResult.fileId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string, bucketType: keyof typeof STORAGE_CONFIGS): Promise<boolean> {
    try {
      const config = STORAGE_CONFIGS[bucketType];
      
      if (!config) {
        return false;
      }

      const { error } = await supabase.storage
        .from(config.bucket)
        .remove([filePath]);

      return !error;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Get media files for an order
   */
  static async getMediaFiles(orderId: string): Promise<MediaFile[]> {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  /**
   * Delete media file from database and storage
   */
  static async deleteMediaFile(fileId: string): Promise<boolean> {
    try {
      // Get file info from database
      const { data: fileData, error: fetchError } = await supabase
        .from('media_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError || !fileData) {
        return false;
      }

      // Delete from storage
      const filePath = fileData.file_url.split('/').pop();
      if (filePath) {
        await this.deleteFile(filePath, 'media-files');
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId);

      return !deleteError;
    } catch (error) {
      console.error('Error deleting media file:', error);
      return false;
    }
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(filePath: string, bucketType: keyof typeof STORAGE_CONFIGS): string {
    const config = STORAGE_CONFIGS[bucketType];
    
    if (!config) {
      return '';
    }

    const { data } = supabase.storage
      .from(config.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Download a file
   */
  static async downloadFile(filePath: string, bucketType: keyof typeof STORAGE_CONFIGS): Promise<Blob | null> {
    try {
      const config = STORAGE_CONFIGS[bucketType];
      
      if (!config) {
        return null;
      }

      const { data, error } = await supabase.storage
        .from(config.bucket)
        .download(filePath);

      if (error) {
        console.error('Error downloading file:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }
} 