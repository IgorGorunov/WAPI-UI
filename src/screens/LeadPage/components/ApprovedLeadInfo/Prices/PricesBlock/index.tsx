import React from "react";
import "./styles.scss";
import {PriceInfoType} from "@/types/leads";
import {Countries} from "@/types/countries";
import {base64ToBlob} from "@/utils/files";
import {ApiResponseType} from "@/types/api";
import {getPriceFile} from "@/services/leads";
import useAuth from "@/context/authContext";
import Icon from "@/components/Icon";

type PricesBlockPropsType = {
    prices: PriceInfoType[];
}

const PricesBlock: React.FC<PricesBlockPropsType> = ({prices}) => {

    const {token} = useAuth();

    const handleDownload = (file) => {
        const blob = base64ToBlob(file.data, file.type);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    const handleDownloadPrice = async (e, uuid) => {
        e.preventDefault();

        try {
            const res: ApiResponseType = await getPriceFile(
                {
                    token: token,
                    uuid: uuid,
                }
            );

            if (res && "status" in res) {
                if (res?.status === 200) {
                    //success
                    res.data.map(file => handleDownload(file));

                }
            } else if (res && 'response' in res ) {

            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            //setIsLoading(false);
        }

    }

    return (
        <div className={`lead-page__prices-block`}>
            <div className="lead-page__prices-block--header">
                <div className='column column-country'>Country</div>
                <div className='column column-prices'>Prices</div>
            </div>
            <ul className="lead-page__prices-block--list">
                {prices && prices.map((price: PriceInfoType, index: number) => (
                    <li
                        key={price.name + "_" + index}
                        className={`lead-page__prices-block--list-item ${
                            index % 2 === 1 ? "highlight" : " "
                        }`}
                    >
                        <div className='column column-country'><span><span className={`fi fi-${price.country.toLowerCase()} flag-icon`}></span>{Countries[price.country]}</span>
                        </div>
                        <div className='column column-prices'><a href={'#'} onClick={(e)=>handleDownloadPrice(e,price.uuid)}><Icon name='download-file' />{price.name}</a></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PricesBlock;
