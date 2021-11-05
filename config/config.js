//https://zsmaxcp.lab.swdemo.ru/rest/740675490/ems/Device?layout=Id,DisplayLabel&filter=MapKey_c='242d43e3-e286-4490-8cb3-4e9f29aed4e0'

export const SYSTEM_VARS = {
    EXTSRVPORT: process.env.EXTSRVPORT || '9000',
    TENANTID: process.env.TENANTID || '740675490',
    TENANTHOST: process.env.TENANTHOST || 'zsmaxcp.lab.swdemo.ru',
    TENANTPORT: process.env.TENANTPORT || '443',    
    DEVICELISTLAYOUT: 'Id,DisplayLabel',
    LOCATIONFILELAYOUT: 'Id,DisplayLabel,LocationAttachments',
    DEVICEFULLLAYOUT: 'Id,SubType,DisplayLabel,HostName,OsName,Brand,Brand.DisplayLabel,AssetModel,AssetModel.DisplayLabel,SerialNumber,PhaseId,AssetTag,Barcode,EmsCreationTime,FirstInstallationDate,PlannedRetirementDate,EntryDate,LastInventoriedDate,Model,CostCenter.Code,CostCenter,CostCenter.DisplayLabel,OwnedByPerson.Upn,LocatedAtLocation.Name,LocatedAtLocation.DisplayLabel,AssetModel.DisplayLabel,LocatedAtLocation.Code,LocatedAtLocation.Id'
};

