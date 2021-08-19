import RNFS from 'react-native-fs';

// Root dir for media storage
const getStreamRootDir = () => `${RNFS.DocumentDirectoryPath}/StreamStorage`;

/* 
  Avatars
*/
const getStreamAvatarsDir = () => `${getStreamRootDir()}/avatars`;
const getStreamChannelAvatarsDir = (cid: string) => `${getStreamAvatarsDir()}/${cid}`;

const getStreamChannelAvatarDir = (cid: string, fileUrl: string) =>
  `${getStreamChannelAvatarsDir(cid)}/${fileUrl}`;

const checkIfLocalAvatar = (cid: string, fileId: string) =>
  RNFS.exists(getStreamChannelAvatarDir(cid, fileId));

async function saveAvatar(cid: string, fileId: string, fileUrl: string) {
  const avatarPath = getStreamChannelAvatarDir(cid, fileId);
  const avatarDir = avatarPath.substr(0, avatarPath.lastIndexOf('/'));

  if (!(await RNFS.exists(avatarDir))) {
    await RNFS.mkdir(avatarDir);
  }

  return RNFS.downloadFile({
    fromUrl: fileUrl,
    toFile: avatarPath,
  }).promise;
}

function removeChannelAvatars(cid: string) {
  return RNFS.unlink(getStreamChannelAvatarsDir(cid)).catch(() =>
    console.log('Skipping already deleted channel cached avatars...'),
  );
}

/* 
  Attachments
*/

const getStreamAttachmentsDir = () => `${getStreamRootDir()}/attachments`;

const getStreamChannelAttachmentsDir = (cid: string) => `${getStreamAttachmentsDir()}/${cid}`;
const getStreamChannelMessageAttachmentsDir = (cid: string, mid: string) =>
  `${getStreamChannelAttachmentsDir(cid)}/${mid}`;

const getStreamChannelMessageAttachmentDir = (cid: string, mid: string, fileUrl: string) =>
  `${getStreamChannelMessageAttachmentsDir(cid, mid)}/${fileUrl}`;

const checkIfLocalAttachment = (cid: string, mid: string, fileId: string) =>
  RNFS.exists(getStreamChannelMessageAttachmentDir(cid, mid, fileId));

async function saveAttachment(cid: string, mid: string, fileId: string, fileUrl: string) {
  const attachmentPath = getStreamChannelMessageAttachmentDir(cid, mid, fileId);
  const attachmentDir = attachmentPath.substr(0, attachmentPath.lastIndexOf('/'));

  if (!(await RNFS.exists(attachmentDir))) {
    await RNFS.mkdir(attachmentDir);
  }

  return RNFS.downloadFile({
    fromUrl: fileUrl,
    toFile: attachmentPath,
  }).promise;
}

function removeChannelAttachments(cid: string) {
  return RNFS.unlink(getStreamChannelAttachmentsDir(cid)).catch(() =>
    console.log('Skipping already deleted channel cached images...'),
  );
}

function removeMessageAttachments(cid: string, mid: string) {
  return RNFS.unlink(getStreamChannelMessageAttachmentsDir(cid, mid)).catch(() =>
    console.log('Skipping already deleted cached image...'),
  );
}

export default {
  checkIfLocalAttachment,
  checkIfLocalAvatar,
  getStreamChannelAvatarDir,
  getStreamChannelMessageAttachmentDir,
  removeChannelAttachments,
  removeChannelAvatars,
  removeMessageAttachments,
  saveAttachment,
  saveAvatar,
};
