import React, { memo } from "react";
import Icon from "@/components/Icon";
import styles from "./styles.module.scss";

const BackgroundLogo: React.FC = () => {
  return (
    <div className={`${styles['login__bg-logo'] || 'login__bg-logo'} login__bg-logo`}>
      <div className={`${styles['logo-icon'] || 'logo-icon'} logo-icon`}>
        <Icon name="bg-logo"/>
      </div>
    </div>
  );
};

export default memo(BackgroundLogo);
