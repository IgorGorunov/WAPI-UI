import React from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import "./styles.scss";

const Header: React.FC = (props) => {
    const handleAddOrder= () => {

    }
    const handleImportXLS = () => {

    }

  return (
      <div className={`card orders-header__container mb-md`}>
          <div className="orders-header__menu">
              <h2>Fulfillment</h2>
          </div>
          <div className="orders-header__buttons">
              <Button icon="add" iconOnTheRight onClick={handleAddOrder}>Add order</Button>
              <Button icon="import-file" iconOnTheRight onClick={handleImportXLS}>Import xls</Button>
          </div>

      </div>
  );
};

export default Header;
