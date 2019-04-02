# ffmpeg-utils

ffmpeg-utils is a collection of ffmpeg-based utils that i use for managing my personal video library

**DO NOT EVER SET THE DESTINATION DIRECTORY THE SAME AS THE SOURCE - FILES WILL BE DELETED** 

## sync.js

Synchronizes a source directory (currently just adds new videos / without subdirs) to a destination directory re-encoding the videos to h264(4 mbits) / aac(256 kbits).

This is done to provide a low bit-rate (streamable) version of high bit-rate videos.

