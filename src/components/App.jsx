import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchQuery } from 'services/api';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { ModalWindow } from 'components/Modal/Modal';
import { Container } from 'components/App.styled';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [largeImage, setLargeImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setLoading(true);

    fetchQuery(searchQuery, page)
      .then(resp => {
        if (resp.images.length === 0) {
          toast.warn(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          setLoading(false);
          return;
        }

        setImages(prevImage => [...prevImage, ...resp.images]);
        setTotalImages(resp.TotalHits);
        setLoading(false);
      })
      .catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const searchQueryValue = value => {
    if (value === searchQuery) {
      toast.warn('Enter another search query!');
      return;
    }

    setSearchQuery(value);
    setPage(1);
    setTotalImages(0);
    setImages([]);
    // showLoadMoreBtn(false);
  };

  const getModalImage = imageUrl => {
    setLargeImage(imageUrl);
  };

  const largeImageStateReset = () => {
    setLargeImage('');
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={searchQueryValue} />

      <ImageGallery images={images} getModalImage={getModalImage} />

      {loading && <Loader />}

      {totalImages !== images.length && <Button onClick={handleLoadMore} />}

      <ToastContainer position="top-center" autoClose={1500} />

      {largeImage && (
        <ModalWindow
          largeImage={largeImage}
          largeImageStateReset={largeImageStateReset}
        />
      )}
    </Container>
  );
}
