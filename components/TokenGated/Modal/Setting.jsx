import React from 'react';

import Modal from 'components/Commons/Modal';
import { DebounceInput } from 'react-debounce-input';
import { useState } from 'react';
export default function Setting({
  show,
  handleClose,
  projectInfo,
  createMode,
}) {
  const links = [
    { title: 'linkInsta', icon: 'instagram', value: '' },
    { title: 'linkGithub', icon: 'github', value: '' },
    { title: 'linkTwitter', icon: 'twitter', value: '' },
    { title: 'linkFacebook', icon: 'facebook', value: '' },
    { title: 'customLinks1', icon: 'link', value: '' },
  ];
  const form = {
    title: '',
    headline: '',
    description: '',
    links: links,
  };
  const [project, setProject] = useState(createMode ? form : projectInfo);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const onDescriptionChange = (text) => {
    let oldProject = { ...project };
    oldProject.description = text;
    setProject(oldProject);
  };

  function onSocialLinkChange(url, index) {
    let oldProject = { ...project };
    oldProject.links[index].value = url;
    setProject(oldProject);
  }
  const updateProject = () => {
    console.log(project);
  };
  return (
    <Modal
      width={564}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={true}
      height={700}
      overflow='scroll'
    >
      <div className='p-10 mt-5'>
        <p className='font-black text-txtblack text-[22px] mb-4'>
          Project Settings
        </p>

        {/* title */}
        <div className='mb-6'>
          <div className='txtblack text-[14px]'>Project Title</div>
          <>
            <DebounceInput
              onChange={($event) => {
                let oldProject = { ...project };
                oldProject.title = $event.target.value;
                setProject(oldProject);
              }}
              minLength={1}
              debounceTimeout={300}
              className='debounceInput mt-1'
              value={project.title}
              placeholder='Enter your project title'
            />
            {isTitleEmpty && (
              <div className='validationTag'>Project title is required</div>
            )}
          </>
        </div>

        {/* headline */}
        <div className='mb-6'>
          <div className='txtblack text-[14px]'>Project Headline</div>
          <>
            <DebounceInput
              onChange={($event) => {
                let oldProject = { ...project };
                oldProject.headline = $event.target.value;
                setProject(oldProject);
              }}
              minLength={1}
              debounceTimeout={300}
              className='debounceInput mt-1'
              value={project.headline}
              placeholder='Enter your project headline'
            />
          </>
        </div>

        {/* description */}
        <div className='mb-6'>
          <div className='txtblack text-[14px] '>Description</div>
          <textarea
            value={project.description}
            onChange={($event) => {
              let oldProject = { ...project };
              oldProject.description = $event.target.value;
              setProject(oldProject);
            }}
            className='p-5 mt-1'
            name='description'
            id='description'
            cols='30'
            rows='6'
            placeholder='Description'
            maxLength={1000}
          ></textarea>
        </div>

        {/* web links */}
        <div className='mb-6'>
          <div className='txtblack text-[14px]'>Add Social Link</div>
          {project?.links?.map((link, index) => (
            <div key={index} className='inline-flex items-center w-full mb-4'>
              <i
                className={` ${
                  link.title.startsWith('customLinks')
                    ? `fa-solid fa-${link.icon}`
                    : `fa-brands fa-${link.icon}`
                }  text-[24px] text-primary-900  mr-2`}
              ></i>
              <input
                className={`block w-full border border-divider h-[48px] text-[14px] text-textSubtle rounded  pl-3  outline-none`}
                placeholder='https://'
                value={link.value}
                onChange={(event) =>
                  onSocialLinkChange(event.target.value, index)
                }
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => updateProject()}
          className='contained-button w-full py-2 text-center'
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
