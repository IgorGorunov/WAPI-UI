import React from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import "./styles.scss";

const Header: React.FC = (props) => {
    const handleAddProduct = () => {

    }
    const handleExportXLS = () => {

    }

  return (
      <div className={`card products-header__container mb-md`}>
          <div className="products-header__menu">
              <h2>Products stock</h2>
          </div>
          <div className="products-header__buttons">
              <Button icon="download-file" iconOnTheRight onClick={handleExportXLS}>Download report</Button>
          </div>

      </div>
  );
};

export default Header;
