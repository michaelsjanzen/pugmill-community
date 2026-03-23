/**
 * StorageProvider interface.
 *
 * All storage backends must implement this contract. The `upload` method
 * receives the raw file buffer + metadata and returns the public URL and
 * a provider-specific `storageKey` used for later deletion.
 */
export interface UploadResult {
  /** Fully-qualified public URL (or an absolute path for local storage). */
  url: string;
  /**
   * Opaque key the provider uses to delete this object.
   * - Local:  "uploads/1234567890-photo.jpg"
   * - S3:     "uploads/1234567890-photo.jpg"  (the S3 object key)
   */
  storageKey: string;
}

export interface StorageProvider {
  /**
   * Persist a file and return its public URL and storage key.
   * @param buffer    Raw file bytes
   * @param fileName  Sanitised filename (with timestamp prefix)
   * @param mimeType  MIME type string
   */
  upload(buffer: Buffer, fileName: string, mimeType: string): Promise<UploadResult>;

  /**
   * Remove a previously uploaded file.
   * If the key does not exist, implementations should resolve silently.
   * @param storageKey  The key returned by `upload()`
   */
  delete(storageKey: string): Promise<void>;
}
