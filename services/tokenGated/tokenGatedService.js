import { client } from '../httpClient';

export async function createTokenGatedProject(payload) {
  return new Promise(async (resolve, reject) => {
    // const bodyFormData = new FormData();
    // if (payload) {
    //   payload.name && bodyFormData.append('name', payload.name);
    //   payload.category_id &&
    //     bodyFormData.append('category_id', payload.category_id);
    //   bodyFormData.append('blockchain', payload.blockchain);
    // }
    // return await client(
    //   'POST',
    //   `/project`,
    //   payload ? bodyFormData : null,
    //   'formdata'
    // );
    setTimeout(() => {
      resolve({
        id: 1,
        logo: '',
        name: '',
        description: '',
        links: [],
        contents: [],
      });
    }, 3000);
  });
}
export async function getTokenGatedProject(payload) {
  return new Promise(async (resolve, reject) => {
    // const bodyFormData = new FormData();
    // if (payload) {
    //   payload.name && bodyFormData.append('name', payload.name);
    //   payload.category_id &&
    //     bodyFormData.append('category_id', payload.category_id);
    //   bodyFormData.append('blockchain', payload.blockchain);
    // }
    // return await client(
    //   'POST',
    //   `/project`,
    //   payload ? bodyFormData : null,
    //   'formdata'
    // );
    setTimeout(() => {
      resolve({
        id: 1,
        logo: '',
        name: '',
        description: '',
        links: [
          {
            title: 'linkInsta',
            icon: 'instagram',
            value: 'https://www.google.com/',
          },
          {
            title: 'linkGithub',
            icon: 'github',
            value: 'https://www.google.com/',
          },
          {
            title: 'linkTwitter',
            icon: 'twitter',
            value: 'https://www.google.com/',
          },
          {
            title: 'linkFacebook',
            icon: 'facebook',
            value: 'https://www.google.com/',
          },
          {
            title: 'customLinks1',
            icon: 'link',
            value: 'https://www.google.com/',
          },
        ],
        contents: [
          {
            id: 1,
            logo: '',
            name: 'Content 1',
            status: 'draft',
            accessible: 'Token ID 500 - 600',
            publishedDate: '',
            fileType: 'png',
          },
          {
            id: 2,
            logo: '',
            name: 'Content 2',
            status: 'published',
            accessible: 'Token ID 500 - 600',
            publishedDate: '10/10-2023',
            fileType: 'png',
          },
        ],
      });
    }, 3000);
  });
}
