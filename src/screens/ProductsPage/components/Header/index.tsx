import React from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import "./styles.scss";



const Header: React.FC = (props) => {
    const handleAddProduct = () => {

    }
    const handleImportXLS = () => {

    }

  return (
      <div className={`card products-header__container mb-md`}>
          <div className="products-header__menu">
              <h2>Products</h2>
          </div>
          <div className="products-header__buttons">
              <Button icon="search" iconOnTheRight onClick={handleAddProduct}>Add product</Button>
              <Button icon="search" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
          </div>

      </div>
  );
};

export default Header;
