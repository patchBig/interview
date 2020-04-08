# url-loader

A loader for webpack which transforms files into base64 URIs.

## options

### fallback

Type: string Default: 'file-loader'

Specifies an alternative loader to use when a target file's size exceeds the limit set in the limit option.

The fallback loader will receive the same configuration options as url-loader.

A number or String specifying the maximum size of a file in bytes. If the file size is equal or greater than the limit file-loader will be used and all query parameters are passed to it. Using an alternative to file-loader is enabled via the fallback option.

#### mimeType

Sets the MIME type for the file to be transformed.If unspecified the file extensions will be used to lookup the MIME type.
