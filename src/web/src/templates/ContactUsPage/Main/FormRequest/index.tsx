import React from 'react';

import cn from 'classnames';

import styles from './FormRequest.module.sass';

import Field from '~/components/Field';
import Modal from '~/components/Modal';
import Select from '~/components/Select';

type FormRequestProps = {
  className?: string;
  title: string;
};

const FormRequest = ({ className, title }: FormRequestProps) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const [topic, setTopic] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [subject, setSubject] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  const options = [
    {
      title: 'Topic 1',
      value: 'topic1',
    },
    {
      title: 'Topic 2',
      value: 'topic2',
    },
    {
      title: 'Topic 3',
      value: 'topic3',
    },
    {
      title: 'Topic 4',
      value: 'topic4',
    },
  ];

  const handleChangeTopic = (value: string) => setTopic(value);

  return (
    <React.Fragment>
      <button
        className={ cn('button', className) }
        onClick={ () => setVisibleModal(true) }>
        {title}
      </button>
      <Modal
        containerClassName={ styles.container }
        visible={ visibleModal }
        onClose={ () => setVisibleModal(false) }>
        <form
          className={ styles.form }
          action=""
          onSubmit={ () => console.log('Submit') }>
          <div className={ cn('h4M', styles.title) }>
            Submit a request
          </div>
          <div className={ styles.info }>
            Amet minim mollit non deserunt ullamco est sit aliqua
            dolor do amet sint.
          </div>
          <Select
            className={ styles.field }
            title="Choose topic"
            icon="chat"
            value={ topic }
            onChange={ handleChangeTopic }
            options={ options } />
          <Field
            className={ styles.field }
            placeholder="Email address"
            icon="mail"
            type="email"
            value={ email }
            onChange={ (e: any) => setEmail(e.target.value) }
            required />
          <Field
            className={ styles.field }
            placeholder="Name"
            icon="profile"
            value={ name }
            onChange={ (e: any) => setName(e.target.value) }
            required />
          <Field
            className={ styles.field }
            placeholder="Subject"
            icon="pencil"
            value={ subject }
            onChange={ (e: any) => setSubject(e.target.value) }
            required />
          <Field
            className={ styles.field }
            placeholder="Description"
            icon="pencil"
            value={ description }
            onChange={ (e: any) => setDescription(e.target.value) }
            textarea
            required />
          <div className={ styles.foot }>
            <button className={ cn('button', styles.button) }>
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default FormRequest;
