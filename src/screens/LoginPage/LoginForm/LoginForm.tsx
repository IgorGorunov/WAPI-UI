import React, {useCallback, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {authenticate, authenticateWithOneTimeToken} from "@/services/auth";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import useAuth from "@/context/authContext";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import Button from "@/components/Button/Button";
import "./styles.scss";
import {UserStatusType} from "@/types/leads";
import {ApiResponseType} from "@/types/api";
import Loader from "@/components/Loader";
import {formFields} from "./LoginFormFields.constants";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";
import {getCleanParamsFromQuery} from "@/utils/query";
import {
  getUserIP,
  getUserLanguage,
  getUserTimezone,
  sendUserBrowserInfo
} from "@/services/userInfo";
import useTenant from "@/context/tenantContext";

type LoginFormPropsType = {
  oneTimeToken?: string;
  setOneTimeToken?: (val: string)=>void;
}

const LoginForm: React.FC<LoginFormPropsType> = ({oneTimeToken, setOneTimeToken}) => {
  const { tenantData } = useTenant();
  const alias = tenantData?.alias;

  const Router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUserName, setCurrentDate, setTutorialInfo, setUserStatus, setTextInfo, setNavItemsAccess, setUserInfoProfile, setIsSuperUser, setUserBrowserInfoFn, setActionAccess, saveSuperUserName, setCurrentUserType } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const [docType, setDocType] = useState('');
  const [docUuid, setDocUuid] = useState('');

  useEffect(() => {
    const cleanQuery = getCleanParamsFromQuery(Router.query);
    const type = cleanQuery['type'];
    const uuid = cleanQuery['uuid'];

    if (type && uuid) {
      setDocType(type);
      setDocUuid(uuid);
    }

  }, [Router.query]);

  const setUserBrowserDataToCookies = async(data) => {

    //get browser data
    const userIp = await getUserIP();
    //const userLocation = await getUserLocation();
    const userTimezone = await getUserTimezone();
    const userLang = await getUserLanguage();
    const userAgentData = navigator.userAgent;

    setUserBrowserInfoFn({userIp, userTimezone, userLang, userAgentData});

    try{
      const userData = data.userProfile?.userInfo;

      await sendUserBrowserInfo({
          headers: [{ip: userIp}, {lang: userLang}, {timezone: userTimezone}, {agent: userAgentData}],
          body: {},
          action: 'Authorize',
          email: userData?.userLogin || '--' ,
          clientName: userData.client,
          token: data.accessToken,
          forbidden: false,
          superUserName: data.superUser ? userData.userName : '',
        })
    } catch (error) {}
  }

  const setAuthData = async(authData) => {
    const { accessToken, userPresentation, currentDate, traningStatus, userStatus, textInfo, access, userProfile, superUser, actionAccessSettings, whiteLabelUserType } = authData;

    setToken(accessToken, userStatus !== UserStatusType.user);

    //Cookie.set('token', accessToken);
    setUserName(userPresentation || 'user');
    setCurrentDate(currentDate);
    setUserStatus(userStatus);
    setTutorialInfo(traningStatus);
    if (textInfo) setTextInfo(textInfo || '');
    setNavItemsAccess(access || []);
    setUserInfoProfile(userProfile?.userInfo || null);
    setCurrentUserType(whiteLabelUserType || null);

    setActionAccess(actionAccessSettings);
    if (!!superUser) setIsSuperUser(!!superUser);

    if (superUser) saveSuperUserName(userProfile?.userInfo?.userName);

    setOneTimeToken('');

    await setUserBrowserDataToCookies(authData);

    switch (userStatus) {
      case 'user':
        if (docType && docUuid) {
          await Router.push({pathname: NOTIFICATION_OBJECT_TYPES[docType], query: {uuid: docUuid}})
        } else {
          await Router.push(Routes.Dashboard);
        }
        return;
      default:
        await Router.push('/lead');
        return;
    }
  }

  const loginUserWithOneTimeToken = useCallback(async() => {
    try {
      setIsLoading(true);
      setError(null);
      //const res = await authenticate("Test@Test.com", "Test");
      const res: ApiResponseType = await authenticateWithOneTimeToken({oneTimeToken, alias});

      if (res?.status === 200) {
        await setAuthData(res.data);

      } else if (res?.response?.status === 401) {
        setError("Wrong token");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [oneTimeToken]);

  useEffect(() => {
    if (oneTimeToken) {
      loginUserWithOneTimeToken();
    }
  }, [oneTimeToken]);


  const {
    control,
    handleSubmit,
  } = useForm({ mode: "onSubmit" });


  const handleFormSubmit = async (data: any) => {
    const { login, password } = data;
    type ApiResponse = {
      data?: any;
      status?: any;
      response?: {
        data?: any;
        status?: number;
      };
    };

    try {
      setIsLoading(true);
      setError(null);
      //const res = await authenticate("Test@Test.com", "Test");
      const res: ApiResponse = await authenticate(login, password, alias);

      if (res?.status === 200) {
        await setAuthData(res.data)
      } else if (res?.response?.status === 401) {
        setError("Wrong login or password");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`card login-form`}>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {formFields.map((curField: any ) => (

          <div key={curField.name} className='grid-row'>
            <Controller
                name={curField.name}
                control={control}
                render={({field: { ...props}, fieldState: {error}}) => (
                <FieldBuilder
                    {...curField}
                    {...props}
                    type={curField.type}
                    name={curField.name}
                    label={curField.label}
                    fieldType={curField.fieldType}
                    placeholder={curField.placeholder}
                    errorMessage={error?.message}
                    isRequired={!!curField.rules?.required || false}
                /> )}
               rules = {curField.rules}
            />
          </div>

        ))}
        {error && <p className="login-error">{error}</p>}
        <div className="login-submit-block">
          {/*<p id='login-recovery-link' className="login-recovery-link">Password recovery</p>*/}
          <Button
            type="submit"
            icon={"arrow-right"}
            iconOnTheRight={true}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
