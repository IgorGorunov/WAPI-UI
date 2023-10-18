import React, { memo } from "react";
import Icon from "@/components/Icon";
import classes from "./BackgroundLogo.module.scss";

const BackgroundLogo: React.FC = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.logo}>
        <Icon name="bg-logo" />
      </div>
      {/* <div className={classes.block1}>
        <Icon name="bg-1" />
      </div>
      <div className={classes.block2}>
        <Icon name="bg-2" />
      </div>
      <div className={classes.block3}>
        <Icon name="bg-3" />
      </div>
      <div className={classes.block4}>
        <Icon name="bg-4" />
      </div>
      <div className={classes.block5}>
        <Icon name="bg-5" />
      </div>
      <div className={classes.block6}>
        <Icon name="bg-6" />
      </div> */}
    </div>
  );
};

export default memo(BackgroundLogo);
