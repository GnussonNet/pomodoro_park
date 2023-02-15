import React from 'react';
import {Image} from 'react-native';
import stage0 from '../assets/img/stage0.png';
import stage1 from '../assets/img/stage1.png';
import stage2 from '../assets/img/stage2.png';
import stage3 from '../assets/img/stage3.png';
import stage4 from '../assets/img/stage4.png';

interface Props {
  pomodoros: number;
}

const Trees: React.FC<Props> = ({pomodoros}) => {
  let imageSource = stage1;

  switch (pomodoros % 4) {
    case 1:
      imageSource = stage1;
      break;
    case 2:
      imageSource = stage2;
      break;
    case 3:
      imageSource = stage3;
      break;
    case 0:
      imageSource = stage4;
      break;
    default:
      break;
  }

  if (pomodoros === 0) {
    imageSource = stage0;
  }

  return <Image className="w-40 h-40 mx-auto mb-20" source={imageSource} />;
};

export default Trees;
