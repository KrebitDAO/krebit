import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { Web3Storage, File } from 'web3.storage';
import Orbis from '@orbisclub/orbis-sdk';

import { Background, Picture, Wrapper } from './styles';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { Close, Upload } from 'components/Icons';
import { formatFilename, formatUrlImage } from 'utils';

// types
import { IProfile } from 'utils/normalizeSchema';

interface IValues {
  background: string | File;
  picture: string | File;
  name: string;
  description: string;
}

interface IProps {
  profile: IProfile;
  onClose: () => void;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
  contextHandleProfile: Dispatch<SetStateAction<IProfile>>;
  orbis: Orbis;
  storage: Web3Storage;
}

const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

export const EditProfile = (props: IProps) => {
  const {
    profile,
    onClose,
    handleProfile,
    contextHandleProfile,
    orbis,
    storage
  } = props;
  const [status, setStatus] = useState('idle');
  const [values, setValues] = useState<IValues>({
    background: '',
    picture: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    if (Object.keys(profile).length === 0) return;

    setValues({
      background: profile?.background || '',
      picture: profile?.picture || '',
      name: profile?.name || '',
      description: profile?.description || ''
    });
  }, [profile]);

  const handleValues = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (files?.length > 0) {
      const reader = new FileReader();
      const file = new File([files[0]], formatFilename(files[0].name), {
        type: files[0].type
      });

      if (!fileTypes.includes(file.type)) return;

      reader.readAsDataURL(files[0]);
      setValues(prevValues => ({
        ...prevValues,
        [name]: file
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setStatus('pending');

    try {
      event.preventDefault();
      let pictureImage: string | File = values.picture;
      let backgroundImage: string | File = values.background;

      if (pictureImage instanceof File) {
        const node = await storage.put([pictureImage] as any);

        if (node) {
          pictureImage = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${node}/${pictureImage.name}`;
        }
      }

      if (backgroundImage instanceof File) {
        const node = await storage.put([backgroundImage] as any);

        if (node) {
          backgroundImage = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${node}/${backgroundImage.name}`;
        }
      }

      const orbisResponse = await orbis.updateProfile({
        pfp: pictureImage,
        cover: backgroundImage,
        username: values.name,
        description: values.description
      });

      if (orbisResponse) {
        const newProfile = {
          ...profile,
          picture: values.picture
            ? (values.picture as string)
            : (pictureImage as string),
          background: values.background
            ? (values.background as string)
            : (backgroundImage as string),
          name: values.name,
          description: values.description
        };

        handleProfile(newProfile);
        contextHandleProfile(newProfile);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
      <Wrapper>
        <div className="edit-box">
          <div className="edit-box-header">
            <p className="edit-box-header-title">Edit your profile</p>
            <div
              className="edit-box-header-close"
              onClick={status === 'pending' ? undefined : onClose}
            >
              <Close />
            </div>
          </div>
          {status === 'pending' ? (
            <div className="edit-box-loading">
              <Loading />
            </div>
          ) : (
            <form
              method="post"
              onSubmit={status === 'pending' ? undefined : handleSubmit}
              className="edit-box-list"
            >
              <p className="edit-box-list-text">
                Upload your background image:
              </p>
              <Background image={formatUrlImage(values?.background)}>
                <input
                  type="file"
                  id="background-file"
                  accept="image/*"
                  name="background"
                  onChange={handleValues}
                />
                <label
                  className="edit-box-list-background"
                  htmlFor="background-file"
                >
                  <Upload />
                </label>
              </Background>
              <p className="edit-box-list-text">Upload your picture:</p>
              <Picture image={formatUrlImage(values?.picture)}>
                <input
                  type="file"
                  id="picture-file"
                  accept="image/*"
                  name="picture"
                  onChange={handleValues}
                />
                <label className="edit-box-list-picture" htmlFor="picture-file">
                  <Upload />
                </label>
              </Picture>
              <p className="edit-box-list-text">Update your name:</p>
              <Input
                name="name"
                placeholder="name"
                value={values?.name}
                onChange={handleValues}
                isRequired={true}
              />
              <p className="edit-box-list-text">Update your description:</p>
              <Input
                name="description"
                placeholder="Description"
                value={values?.description}
                onChange={handleValues}
                isRequired={true}
                isMultiline={true}
              />
              <div className="edit-box-button">
                <Button
                  type="submit"
                  text="Save"
                  onClick={() => {}}
                  isDisabled={status === 'pending'}
                />
              </div>
            </form>
          )}
        </div>
      </Wrapper>
    </>
  );
};
