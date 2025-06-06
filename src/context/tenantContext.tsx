import React, {
    createContext,
    PropsWithChildren,
    useContext, useState,
} from "react";
import {tenants, TenantDataType, TENANT_TYPE} from "@/lib/tenants";



type tenantContextType = {
    tenant: TENANT_TYPE;
    setTenant: (tenant: TENANT_TYPE) => void;
    tenantData: TenantDataType;
    getTenantData: (tenant: TENANT_TYPE) => TenantDataType | null;
};

export const TenantContext = createContext<tenantContextType>({} as tenantContextType);

const useTenant = (): tenantContextType => {
    return useContext(TenantContext);
};

// export const TenantProvider = (props: PropsWithChildren) => {
//     const [tenant, setTenant] = useState<null|TENANT_TYPE>(null);
//     const getTenantData = (tenant: TENANT_TYPE): TenantDataType => {
//         return tenants[tenant] || null;
//     }
//
//     return (
//         <TenantContext.Provider value={{
//             tenant, setTenant, getTenantData
//         }}>
//             {props.children}
//         </TenantContext.Provider>
//     );
// };

export default useTenant;
