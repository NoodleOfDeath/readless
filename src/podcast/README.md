# TheSkoop Podcast

This submodule contains the code for the podcast automation. The audio service script essentially clips each audio file downloaded from [murf.ai](https://murf.ai), by half at the end, then merges all of the files together in the order they were modified. It would be nice to dockerize this into a single container and host it on the cloud; the only caveat is that the host needs to have `ffmpeg` installed.
