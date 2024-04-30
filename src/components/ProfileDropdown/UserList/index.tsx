import React, {useEffect, useState} from 'react';
import './styles.scss'
import Icon from "@/components/Icon";
import useAuth, {NavAccessItemType, UserInfoType} from "@/context/authContext";
import Loader from "@/components/Loader";
import SearchContainer from "@/components/SearchContainer";
import SearchField from "@/components/SearchField";

export type UserType = {
    access: NavAccessItemType[];
    userProfile: {
        userInfo: UserInfoType;
    };
    userPresentation: string;
    userLogin: string;
    uuid: string;
}

type UserListPropsType = {
    users: UserType[];
    onClose: ()=>void;
}

const UserList: React.FC<UserListPropsType> = ({users, onClose}) => {
    const { setUserUi, setUserName, setUserInfoProfile, setNavItemsAccess } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    //const [users, setUsers] = useState<UserType[] | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UserType[] | null>(users);
    //search
    const [searchTermClients, setSearchTermClients] = useState('');

    useEffect(() => {
        //search
        const filterNotifications = users.filter(user => {
            const matchesSearch = !searchTermClients.trim() || Object.keys(user).some(key => {
                const value = user[key];
                if (key !== 'uuid' && key !== 'objectUuid') {
                    const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                    const searchTermsArray = searchTermClients.trim().toLowerCase().split(' ');
                    return searchTermsArray.every(word => stringValue.includes(word));
                }
                return false;
            });

            return matchesSearch
        });

        setFilteredUsers(filterNotifications);

    }, [searchTermClients]);

    const handleSearchChange = (newSearchTerm :string) => {
        setSearchTermClients(newSearchTerm);
    };

    const handleUserChange = async(user: UserType) => {
        setUserUi(user.uuid);
        setUserName(`SU - ${user.userPresentation}`);
        setNavItemsAccess(user.access);
        setUserInfoProfile(user.userProfile.userInfo);
        onClose();
    }


    return (
        <>
            {isLoading && <Loader />}
            {users && users.length ?
                <div className="users-list">
                    {/* search */}
                    <div className='notifications-block__search'>
                        <SearchContainer>
                            <SearchField searchTerm={searchTermClients} handleChange={handleSearchChange} handleClear={()=>{setSearchTermClients("");}} />
                            {/*<FieldBuilder {...fullTextSearchField} />*/}
                        </SearchContainer>
                    </div>
                    <ul className='users-list__list has-scroll'>
                        {filteredUsers.map(item => <li key={item.uuid} className='users-list__list-item'><button onClick={()=>handleUserChange(item)}><Icon name='profile' />{item.userProfile.userInfo.client} ({item.userProfile.userInfo.userLogin})</button></li> )}
                    </ul>
                </div>
            : null}
        </>
    );
};

export default UserList;