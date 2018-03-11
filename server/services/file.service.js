import fs from 'fs';
import last from 'lodash/last';
import srt2vtt from 'srt-to-vtt';

export const MOVIE_PATH = '/Users/tronbe/Movies';

export const isHiddenFile = filename => filename.indexOf('.') === 0;
export const isDeleted = filePath => !fs.existsSync(filePath);
export const changeFileType = (file, newFileType) => {
  const fileSplit = file.split('.');
  fileSplit[fileSplit.length - 1] = newFileType;
  return fileSplit.join('.');
};

export const getFileType = fileName => last(fileName.split('.'));

export const getSubtitleUrl = path => {
  const fileName = changeFileType(path, 'vtt');

  const exist = fs.existsSync(fileName);
  return exist ? fileName : '';
};

export const readAllMovies = (path = MOVIE_PATH) => {
  const files = fs.readdirSync(path);
  const outFiles = [];

  files.forEach(file => {
    if (
      isHiddenFile(
        file,
      ) /* ||
      this.currentlyConverting.indexOf(`${path}/${file}`) >= 0 */
    ) {
      // Don't return files starting with . altso known as hidden files
      // Don't return files currently in conversion
      return;
    }

    const stat = fs.statSync(`${path}/${file}`);
    const isDirectory = stat.isDirectory();
    const isFile = stat.isFile();
    const fileType = isFile ? getFileType(file) : null;

    if (isDirectory) {
      const recursiveFiles = readAllMovies(`${path}/${file}`);
      recursiveFiles.forEach(item => outFiles.push(item));
    } else if (fileType === 'mkv' || fileType === 'mp4') {
      outFiles.push({
        name: file,
        fileType,
        fullPath: `${path}/${file}`,
        subtitleUrl: getSubtitleUrl(`${path}/${file}`),
      });
    }
  });

  return outFiles;
};

export const getStream = (path, options) =>
  fs.createReadStream(path, options || {});

export const convertSrtToVtt = filePath => {
  const vttFileName = changeFileType(filePath, 'vtt');

  fs
    .createReadStream(filePath)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(vttFileName));
};

export const deleteFileIfExists = filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteMovieAndSubtitles = filePath => {
  const srt = changeFileType(filePath, 'srt');
  const vtt = changeFileType(filePath, 'vtt');
  deleteFileIfExists(filePath);
  deleteFileIfExists(vtt);
  deleteFileIfExists(srt);
};
