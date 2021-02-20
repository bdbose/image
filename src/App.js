import './styles.css';
import React, { createRef, useEffect, useState } from 'react';
import Axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PersonIcon from '@material-ui/icons/Person';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default function App() {
  const search = createRef();
  const [images, setImages] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loaded, setIsLoaded] = React.useState(false);
  const ClientId = 'zYer1fRjlYNPTvP-5ulNpALcZTnAHUUhXmXDMD1us78';
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = useState({});
  const [data, setData] = useState({});
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getData = async (pageNo) => {
    setIsLoaded(false);
    Axios.get(
      `https://api.unsplash.com/search/collections?client_id=${ClientId}&page=${pageNo}&query=${
        search.current.value || 'dark'
      }`,
    )
      .then((res) => {
        console.log(res);
        setData(res.data);
        setImages(res.data.results);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        alert('Rate Limit Exceeded Please Try Later!');
        // window.location.href = "/";
        setIsLoaded(true);
      });
  };
  console.log(images);
  const fall =
    'https://images.unsplash.com/photo-1495431088732-09e59535d241?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max';
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='App'>
      <div className='title'>Search Photos</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          getData(1);
        }}>
        <input ref={search} type='text' placeholder='eg. Love' />
        <input type='submit' value='Search' />
      </form>
      {loaded && images.length > 0 ? (
        <>
          <div className='display'>
            {images.map((i) => {
              return (
                <div
                  className='display-container'
                  onClick={() => {
                    setDetails({
                      img: i.preview_photos
                        ? i.preview_photos[0].urls.regular
                        : fall,
                      name: i.user.name,
                      like: i.user.total_likes,
                      profile: i.user.profile_image.medium,
                    });
                    handleClickOpen();
                  }}
                  key={i.key}>
                  <img
                    src={
                      i.preview_photos ? i.preview_photos[0].urls.regular : fall
                    }
                    alt=''
                  />
                  <div className='user-details'>
                    <span className='details'>
                      <PersonIcon />
                      {i.user.name}
                    </span>
                    <span className='details'>
                      <FavoriteIcon />
                      {i.user.total_likes}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='page-count'>
            {page > 1 ? (
              <button
                onClick={() => {
                  setPage(page - 1);
                  getData(page - 1);
                }}>
                Previos
              </button>
            ) : null}
            <div>Page: {page}</div>
            {page < data.total_pages ? (
              <button
                onClick={() => {
                  setPage(page + 1);
                  getData(page + 1);
                }}>
                Next
              </button>
            ) : null}
          </div>
          <div>Your Search have {data.total_pages} pages.</div>
        </>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            marginTop: '5vh',
            justifyContent: 'center',
          }}>
          Loading. . .
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div className='dialog-content'>
              <img
                id='preview'
                src={details.img}
                width='auto'
                height='100%'
                alt=''
              />
              <div className='user-details-dialog'>
                {details.profile ? (
                  <img
                    src={details.profile}
                    style={{ borderRadius: '50%' }}
                    width='50px'
                    height='50px'
                    alt=''
                  />
                ) : null}
                <span className='details'>{details.name}</span>
                <span className='details'>
                  <FavoriteIcon />
                  {details.like}
                </span>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
