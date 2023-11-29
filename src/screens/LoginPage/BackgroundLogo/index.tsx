import React, { memo } from "react";
import Icon from "@/components/Icon";
import "./styles.scss";

const BackgroundLogo: React.FC = () => {
  return (
    <div className="login__bg-logo">
      <div className="logo-icon">
        <Icon name="bg-logo"/>
      </div>
    </div>
  );
};

export default memo(BackgroundLogo);
