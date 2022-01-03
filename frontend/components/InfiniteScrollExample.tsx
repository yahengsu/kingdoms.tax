import { User } from '@firebase/auth';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactLoading from 'react-loading';
import getUserVideos, { GetUserVideosResult, VideoData } from '../../lib/storage/getUserVideos';
import VideoItem from './VideoItem';

type HistoryPageProps = {
  user: User;
};

const HistoryPage: React.FC<HistoryPageProps> = ({ user }) => {
  const numToFetch = 10;

  const [userVideos, setUserVideos] = useState<VideoData[]>([]);
  const [lastSeen, setLastSeen] = useState<QueryDocumentSnapshot | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (user && user.email) {
          const res = await getUserVideos(user.email, numToFetch);

          if (res.videos.length < numToFetch) {
            setHasMore(false);
          }

          console.log(res);
          setUserVideos((prevState) => prevState.concat(res.videos));
          setLastSeen(res.lastItem);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const spinLoader = (
    <div className={'flex justify-center items-center mt-6'}>
      <ReactLoading type={'spin'} color={'#8b5cf6'} height={'60px'} width={'60px'} />
    </div>
  );

  const getMoreVideos = () => {
    console.log('get more videos');
    (async () => {
      try {
        if (user.email) {
          let res: GetUserVideosResult;

          if (lastSeen) {
            res = await getUserVideos(user.email, numToFetch, lastSeen);
          } else {
            res = await getUserVideos(user.email, numToFetch);
          }

          if (res.videos.length < numToFetch) {
            setHasMore(false);
          }

          console.log(res);
          setUserVideos((prevState) => prevState.concat(res.videos));
          setLastSeen(res.lastItem);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  };

  return (
    <div className={'w-full h-full'}>
      <h1 className={'text-4xl font-bold mb-9'}>Your Saved Recordings</h1>
      <div className={'w-full grid grid-cols-12 px-4 text-lg font-medium pb-2'}>
        <div className={'col-span-6'}>Name</div>
        <div className={'col-span-4'}>Date</div>
        <div className={'col-span-2'}>Size</div>
      </div>
      <InfiniteScroll next={getMoreVideos} hasMore={hasMore} loader={spinLoader} dataLength={userVideos.length}>
        {userVideos.map((video) => (
          <VideoItem key={video.name} {...video} />
        ))}
      </InfiniteScroll>
    </div>
  );
};