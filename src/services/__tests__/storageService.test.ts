import { StorageService, UploadResult } from '../storageService';

// Mock Supabase client
jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        remove: jest.fn(),
        download: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    }),
  },
}));

describe('StorageService', () => {
  let mockFile: File;
  let mockBlob: Blob;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock file
    mockFile = new File(['test content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    // Create mock blob
    mockBlob = new Blob(['test content'], { type: 'image/jpeg' });
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      const mockUploadResponse = {
        data: { path: 'test/path/file.jpg' },
        error: null,
      };

      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/file.jpg' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);

      const result = await StorageService.uploadFile(
        mockFile,
        'test.jpg',
        'media-files'
      );

      expect(result.success).toBe(true);
      expect(result.fileUrl).toBe('https://example.com/file.jpg');
      expect(result.fileId).toBe('test/path/file.jpg');
    });

    it('should handle file size validation', async () => {
      // Create a large file
      const largeFile = new File(['x'.repeat(60 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const result = await StorageService.uploadFile(
        largeFile,
        'large.jpg',
        'media-files'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File size exceeds maximum allowed size');
    });

    it('should handle invalid file type', async () => {
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });

      const result = await StorageService.uploadFile(
        invalidFile,
        'test.txt',
        'media-files'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File type text/plain is not allowed');
    });

    it('should handle upload error', async () => {
      const mockUploadResponse = {
        data: null,
        error: { message: 'Upload failed' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);

      const result = await StorageService.uploadFile(
        mockFile,
        'test.jpg',
        'media-files'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload failed');
    });

    it('should handle invalid bucket type', async () => {
      const result = await StorageService.uploadFile(
        mockFile,
        'test.jpg',
        'invalid-bucket' as any
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid bucket type');
    });
  });

  describe('uploadMediaFile', () => {
    it('should successfully upload media file and save to database', async () => {
      const mockUploadResponse = {
        data: { path: 'test/path/file.jpg' },
        error: null,
      };

      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/file.jpg' },
      };

      const mockDatabaseResponse = {
        data: { id: 'db-file-id' },
        error: null,
      };

      const mockStorage = require('../supabase').supabase.storage;
      const mockSupabase = require('../supabase').supabase;

      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);
      mockSupabase.from().insert().select().single.mockResolvedValue(mockDatabaseResponse);

      const result = await StorageService.uploadMediaFile(
        mockFile,
        'test.jpg',
        'order-123',
        'user-456'
      );

      expect(result.success).toBe(true);
      expect(result.fileUrl).toBe('https://example.com/file.jpg');
      expect(result.fileId).toBe('db-file-id');
    });

    it('should handle database insert error and cleanup uploaded file', async () => {
      const mockUploadResponse = {
        data: { path: 'test/path/file.jpg' },
        error: null,
      };

      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/file.jpg' },
      };

      const mockDatabaseResponse = {
        data: null,
        error: { message: 'Database error' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      const mockSupabase = require('../supabase').supabase;

      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);
      mockSupabase.from().insert().select().single.mockResolvedValue(mockDatabaseResponse);
      mockStorage.from().remove.mockResolvedValue({ error: null });

      const result = await StorageService.uploadMediaFile(
        mockFile,
        'test.jpg',
        'order-123',
        'user-456'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(mockStorage.from().remove).toHaveBeenCalledWith(['test/path/file.jpg']);
    });
  });

  describe('uploadAvatar', () => {
    it('should successfully upload avatar and update user profile', async () => {
      const mockUploadResponse = {
        data: { path: 'user-123/avatar.jpg' },
        error: null,
      };

      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/avatar.jpg' },
      };

      const mockUpdateResponse = {
        error: null,
      };

      const mockStorage = require('../supabase').supabase.storage;
      const mockSupabase = require('../supabase').supabase;

      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);
      mockSupabase.from().update().eq.mockResolvedValue(mockUpdateResponse);

      const result = await StorageService.uploadAvatar(
        mockFile,
        'avatar.jpg',
        'user-123'
      );

      expect(result.success).toBe(true);
      expect(result.fileUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should handle profile update error and cleanup uploaded file', async () => {
      const mockUploadResponse = {
        data: { path: 'user-123/avatar.jpg' },
        error: null,
      };

      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/avatar.jpg' },
      };

      const mockUpdateResponse = {
        error: { message: 'Profile update failed' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      const mockSupabase = require('../supabase').supabase;

      mockStorage.from().upload.mockResolvedValue(mockUploadResponse);
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);
      mockSupabase.from().update().eq.mockResolvedValue(mockUpdateResponse);
      mockStorage.from().remove.mockResolvedValue({ error: null });

      const result = await StorageService.uploadAvatar(
        mockFile,
        'avatar.jpg',
        'user-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Profile update failed');
      expect(mockStorage.from().remove).toHaveBeenCalledWith(['user-123/avatar.jpg']);
    });
  });

  describe('deleteFile', () => {
    it('should successfully delete a file', async () => {
      const mockRemoveResponse = {
        error: null,
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().remove.mockResolvedValue(mockRemoveResponse);

      const result = await StorageService.deleteFile('test/path/file.jpg', 'media-files');

      expect(result).toBe(true);
      expect(mockStorage.from().remove).toHaveBeenCalledWith(['test/path/file.jpg']);
    });

    it('should handle delete error', async () => {
      const mockRemoveResponse = {
        error: { message: 'Delete failed' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().remove.mockResolvedValue(mockRemoveResponse);

      const result = await StorageService.deleteFile('test/path/file.jpg', 'media-files');

      expect(result).toBe(false);
    });

    it('should handle invalid bucket type', async () => {
      const result = await StorageService.deleteFile('test/path/file.jpg', 'invalid-bucket' as any);

      expect(result).toBe(false);
    });
  });

  describe('getMediaFiles', () => {
    it('should successfully fetch media files for an order', async () => {
      const mockFiles = [
        {
          id: 'file-1',
          order_id: 'order-123',
          file_name: 'test1.jpg',
          file_url: 'https://example.com/test1.jpg',
          file_type: 'image/jpeg',
          file_size: 1024,
          mime_type: 'image/jpeg',
          uploaded_by: 'user-456',
          is_public: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().order().mockResolvedValue({
        data: mockFiles,
        error: null,
      });

      const result = await StorageService.getMediaFiles('order-123');

      expect(result).toEqual(mockFiles);
    });

    it('should handle database error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().order().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await StorageService.getMediaFiles('order-123');

      expect(result).toEqual([]);
    });
  });

  describe('deleteMediaFile', () => {
    it('should successfully delete media file from database and storage', async () => {
      const mockFileData = {
        id: 'file-1',
        file_url: 'https://example.com/test.jpg',
      };

      const mockSupabase = require('../supabase').supabase;
      const mockStorage = require('../supabase').supabase.storage;

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockFileData,
        error: null,
      });

      mockStorage.from().remove.mockResolvedValue({ error: null });
      mockSupabase.from().delete().eq.mockResolvedValue({ error: null });

      const result = await StorageService.deleteMediaFile('file-1');

      expect(result).toBe(true);
    });

    it('should handle file not found', async () => {
      const mockSupabase = require('../supabase').supabase;

      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'File not found' },
      });

      const result = await StorageService.deleteMediaFile('file-1');

      expect(result).toBe(false);
    });
  });

  describe('getPublicUrl', () => {
    it('should return public URL for valid bucket type', () => {
      const mockPublicUrlResponse = {
        data: { publicUrl: 'https://example.com/file.jpg' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().getPublicUrl.mockReturnValue(mockPublicUrlResponse);

      const result = StorageService.getPublicUrl('test/path/file.jpg', 'media-files');

      expect(result).toBe('https://example.com/file.jpg');
    });

    it('should return empty string for invalid bucket type', () => {
      const result = StorageService.getPublicUrl('test/path/file.jpg', 'invalid-bucket' as any);

      expect(result).toBe('');
    });
  });

  describe('downloadFile', () => {
    it('should successfully download a file', async () => {
      const mockBlob = new Blob(['test content']);
      const mockDownloadResponse = {
        data: mockBlob,
        error: null,
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().download.mockResolvedValue(mockDownloadResponse);

      const result = await StorageService.downloadFile('test/path/file.jpg', 'media-files');

      expect(result).toBe(mockBlob);
    });

    it('should handle download error', async () => {
      const mockDownloadResponse = {
        data: null,
        error: { message: 'Download failed' },
      };

      const mockStorage = require('../supabase').supabase.storage;
      mockStorage.from().download.mockResolvedValue(mockDownloadResponse);

      const result = await StorageService.downloadFile('test/path/file.jpg', 'media-files');

      expect(result).toBe(null);
    });

    it('should handle invalid bucket type', async () => {
      const result = await StorageService.downloadFile('test/path/file.jpg', 'invalid-bucket' as any);

      expect(result).toBe(null);
    });
  });
}); 