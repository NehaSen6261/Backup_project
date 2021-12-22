
// local host.

// let api_domain = "http://127.0.0.1:1520/sfactory"
// let api_domain = "http://dev-fogwing-sfactory.southindia.cloudapp.azure.com:8080/sfactory"
let api_domain = "http://dev-fogwing-sfactory.southindia.cloudapp.azure.com:4001/sfactory"  
// let api_domain = "https://demoapi.sfactrix.ai/sfactory"
// let api_domain = "http://demo2-fogwing-sfactory.westindia.cloudapp.azure.com:8080/sfactory"
// let api_domain = "https://api.sfactrix.ai/sfactory"
// let api_domain = "http://prod2-fogwing-sfactory.southeastasia.clouda pp.azure.com:5000/sfactory"
// let api_domain = "https://apinode.fogwing.net/sfactory" 



export const login:any={
  Login:api_domain+'/usercredentials/login'
}

// account activations
export const account_activations:any={
  activateuser:api_domain+'/usercredentials/activateuser/'
}

//report
export const report:any={
  getreport:api_domain+'/reports/reports'
}

// otp generation.
export const otp:any={
  Otp:api_domain+'/usercredentials/generateotp/'
}

// registration.
export const registartion:any={
  register:api_domain+'/usercredentials/register',
  email_validations: api_domain+'/usercredentials/checkmail/',
  promocode_validations: api_domain + '/usercredentials/checkcouponcode/'
}


// user profile.
export const userprofile:any={
  User_profile:api_domain+'/usercredentials/updateuserprofile/'
}


// forgot password.
export const forgotpassword:any={
  Forgot_password:api_domain+'/usercredentials/updatepassword/'
}


// users.
export const users:any={
  Tenant_Users:api_domain+'/usercredentials/tenantusers/',
  post_user: api_domain + '/usercredentials/adduser',
  put_user:api_domain + '/usercredentials/updateuser/',
  delete_user:api_domain+'/usercredentials/deactivateuser/',
  SubTenant_Users:api_domain+'/subtenant/users/subtuserslist/',
  post_sub_tenant_user: api_domain + '/subtenant/users/addsubtenantuser',
  put_sub_tenant_user: api_domain + '/subtenant/users/updatesubtenantuser/',
  delete_sub_tenant_user: api_domain + '/subtenant/users/deactivesubtenantusr/',
  get_Tenant_User_Info: api_domain + '/usercredentials/userinfousp/',
  get_SubTenant_User_Info: api_domain + '/subtenant/users/subtuserinfo/',
  get_tenant_users_list: api_domain+ '/usercredentials/tenantuserslist/'
}


// tenant profile.
export const tenant:any={
  tenant_Info:api_domain+'/usercredentials/gettenant/'
}


// dashboard.
export const dashboard:any={
  put_db_th_cards:api_domain+'/dashboard/updatedashboardtheme/',
  cu_usr_th_cards:api_domain+'/dashboard/createuptheme',
  get_user_theme:api_domain+'/dashboard/getuserdashboardtheme/',
  get_time_zone:api_domain+'/asset/assetplanttzone/'
}

// plantdashboard
export const plantdashboard:any={
  get_lastdaysqsi_plant:api_domain+'/assetefanalysis/plantlastdaysqsip/',
  get_lastdaysrdftime:api_domain+'/assetefanalysis/lastdaysplantrdftime/',
  get_user_plant_theme:api_domain+'/dashboard/getplantuserdashboardtheme/',
     // added the workorder list for the plantdashboard
  get_plant_dashboard_workorder_name_list : api_domain +'/project/work_order_list/',
  get_plant_dashboard_work_ordar:api_domain+'/assetefanalysis/plantworkorderperformence/',
  get_plant_dashboard_list:api_domain+'/plant/plantlist/',
  get_plant_time_zone :api_domain +'/plant/planttzone/'
}

// Data Logs.
export const datalogs:any={
  Ondemand_datalogs:api_domain+'/datalogs/getondemanddatalogs',
  Ondemand_datalogsGraph:api_domain+'/datalogs/getondemanddatalogsgraph',
  Ondemand_datalogsCSV:api_domain+'/datalogs/getondemanddatalogscsv/',
  lastdays_tenant_datalogs:api_domain+'/datalogs/tenantsddlogs/',
  lastdays_subtenant_datalogs:api_domain+'/datalogs/subtenantsddlogs/'
}

// Devices.
export const devices:any={
  Devices_info:api_domain+'/devices/deviceinfo/', 
  Tenant_devices:api_domain+'/devices/tenantdevicelist/', 
  Tenant_devices_with_health: api_domain+'/devices/tenantdevices/', 
  SubTenant_devices: api_domain+'/subtenant/subtenantdevices/',
  SubTenant_devices_with_health: api_domain+'/subtenant/subtenantdeviceshealth/',
  asset_devices:api_domain+'/devices/assetdevices/', 
  asset_devices_list:api_domain+'/devices/assetdeviceslist/', 
  tenant_na_devices_list:api_domain+'/devices/tenantdevicenaslist/' 
}


// Analysis.
export const analysis:any={
  analysis_list:api_domain+'/datalogs/deviceanalysis/', 
  attr_detailed_analysis: api_domain + '/datalogs/attrdetailedanalysis/', 
  current_attr_analysis: api_domain + '/datalogs/attcurrentanalysis/',
  last_24hr_attr_analysis: api_domain + '/datalogs/attrtwentyfrhanalysis/',
  last_7days_attr_analysis: api_domain + '/datalogs/attrsevendanalysis/',
  last_12months_attr_analysis: api_domain + '/datalogs/attrtwelevemanalysis/',
  last_30days_attr_analysis: api_domain + '/datalogs/attrthirtydanalysis/',
  all_device_attr_analysis: api_domain + '/datalogs/attrdallanalysis/'
}


// Device Attributes.
export const attributes:any={
  attributes_list:api_domain+'/attributes/attributelist/',
  multi_dev_attributes_list:api_domain+'/attributes/getmultideviceattr/',
  attribute_uom_info:api_domain+'/attributes/getattruom/',
  device_attribute_list : api_domain+'/attributes/attributelist/'
}


// Alerts Attributes.
export const alerts:any={
  tenant_currentday_alerts:api_domain+'/alerts/getttodayalrts/',
  tenant_weekly_alerts:api_domain+'/alerts/gettweekalrts/',
  tenant_monthwise_alerts:api_domain+'/alerts/gettmonthwisealrts/'
}

// Device Health.
export const devicehealth:any={
  tenant_current_health:api_domain+'/devicehealth/gettcurrdevicehealth/',
  tenant_weekly_health:api_domain+'/devicehealth/gettdevicehealth/',
  tenant_weekly_health_table:api_domain+'/devicehealth/gettdevicehealthtab/',
}


// Sub Tenant.
export const subtenant:any={
  post_subtenant:api_domain+'/subtenant/addsubtenant',
  put_subtenant:api_domain+'/subtenant/updatesubtenant/',
  inactivate_subtenant:api_domain+'/subtenant/inactivesubtenant/',
  delete_subtenant:api_domain+'/subtenant/deactivesubtenant/',
  get_tenant_subtenant:api_domain+'/subtenant/tsubtenants/',
  subtenant_info:api_domain+'/subtenant/subtenant/'
}

// User Roles
export const userroles:any={
  get_factory_user_roles:api_domain+'/rolemaster/allroles'
}


// Data Rules
export const datarules:any={
  post_dlue:api_domain+'/datarules/adddatarule',
  inactivate_dlure:api_domain+'/datarules/activatedrule/',
  delete_dlure:api_domain+'/datarules/deletedrule/',
  get_tenant_drules:api_domain+'/datarules/tenantdrlues/',
  get_user_drules:api_domain+'/datarules/getuserdatarules/',
  get_drule_info:api_domain+'/datarules/druleinfo/'
}

//Device Control Panel
export const controlpanel:any={
  post_ctrlpanel:api_domain+'/ctrlpanel/addctrlpanel',
  delete_ctrlpanel:api_domain+'/ctrlpanel/deletectrlpanelitem/',
  get_tenant_ctrlpanels:api_domain+'/ctrlpanel/tenantctrlpanels/',
  get_subtenant_ctrlpanels:api_domain+'/ctrlpanel/subtenantctrlpanels/'
}

//  Factory Control Panel.
export const factory_controlpanel:any={
  post_asset_cntrl_panel:api_domain+'/factoryctrlpanel/addfactoryctrlpanel',
  get_tenant_factory_cntrl_panel:api_domain+'/factoryctrlpanel/tenantfactctrlpanels/',
  get_tenant_factory_plant_cntrl_panel:api_domain+'/factoryctrlpanel/plantsfactctrlpanels/',
  delete_asset_cntrl_panel:api_domain+'/factoryctrlpanel/deletefactoryctrlpanel/'
}

//  Attribute metrics master
export const attributemetrics:any={
  post_attr_metrics:api_domain+'/attributemetric/addattrmetrics',
  put_attr_metrics:api_domain+'/attributemetric/updateattrmetricsti/',
  post_put_attr_metrics:api_domain+'/attributemetric/addupattrmetrics',
  get_attr_metrics:api_domain+'/attributemetric/attrmetricsinfo/',
  get_attr_str_metrics:api_domain+'/attributemetric/attrstrmetricsinfo/'
}


//  Notifications.
export const notifications:any={
  put_notification:api_domain+'/notifications/updatenotification/',
  get_tenant_noti_list:api_domain+'/notifications/gettenantnotilist/',
  get_tenant_noti_limit:api_domain+'/notifications/gettenantnotilimit/',
  get_tenant_noti_count:api_domain+'/notifications/gettenantnoticount/',
  get_tenant_noti_alert_cmd_event_count_list:api_domain+'/notifications/tenantalertcmdnoti/'
}

// Plants.
export const plants:any={
  post_plant:api_domain+'/plant/addplant',
  put_plant:api_domain+'/plant/updateplant/',
  delete_plant:api_domain+'/plant/deactivateplant/',
  get_tenant_plants:api_domain+'/plant/tenantplant/',
  get_plant_info:api_domain+'/plant/plantinfo/',
  get_tenant_plant_list:api_domain+'/plant/tenantplantlist/',
  get_plant_plant_id:api_domain+'/plant/plantplants/'
}

// Work centers.
export const workcenters:any={
  post_workcentre:api_domain+'/workcentre/addworkcentre',
  put_workcentre:api_domain+'/workcentre/updateworkcentre/',
  delete_workcenter:api_domain+'/workcentre/deactivateworkcentre/',
  get_tenant_workcenters:api_domain+'/workcentre/tenantworkcentre/',
  get_workcenter_wrkcntrid:api_domain+'/workcentre/workcentreid/',
  get_tenant_workcenters_list:api_domain+'/workcentre/tenantworkcentrelist/',
  get_plant_workcenters:api_domain+'/workcentre/plantworkcentre/',
  get_plant_workcenter_list:api_domain+'/workcentre/plantworkcentrelist/',
  get_workcenter_info:api_domain+'/workcentre/workcentreinfo/',
  get_time_zone:api_domain+'/plant/planttzone/',
  get_workcenter_list:api_domain +'/workcentre/workcentrelist/'
}

// Assets
export const assets:any={
  post_asset:api_domain+'/asset/addasset',
  put_asset:api_domain+'/asset/updateasset/',
  delete_asset:api_domain+'/asset/deleteasset/',
  get_tenant_assets:api_domain+'/asset/tenantasset/',
  get_tenant_assets_list:api_domain+'/asset/tenantassetslist/',
  get_asset_info:api_domain+'/asset/assetinfo/',
  get_workcenter_assets:api_domain+'/asset/workcenterasset/',
  get_workcenter_asset_id:api_domain+'/asset/assets/',
  get_workcenters_assets_list:api_domain+'/asset/wcassetslist/',
  get_tenant_assets_status:api_domain+'/asset/tenantassetstatus/',
  get_plantassets_status:api_domain+'/asset/plantassetstatus/',
  // get_assets_plant_id:api_domain+'/asset/plantassets/',
  get_assets_plant_workcenter_id:api_domain+'/asset/plantassets', 
  get_job_assest:api_domain +'/asset/jobasset/',
  get_plantjobasset:api_domain+'/asset/plantjobasset/',
  get_assetlist_date:api_domain+'/project/assetlist/',
  get_job_operator_assets: api_domain+'/asset/joboperatorasset/',
  get_all_tenant_assetlist:api_domain+'/asset/alltenantassetlist/',
  get_multi_wc_asset:api_domain+'/asset/workcenterassetslist/'
}

// Asset analysis.
export const asset_analysis:any={
  get_latest_analysis:api_domain+'/assetdatalog/latestassetmetrics/',
  trend_latest_analysis:api_domain+'/assetdatalog/assetmetrics/'
}

// mapper
export const mapper:any={
  post_mapper:api_domain+'/assetdevicemapper/addmapper',
  put_mapper:api_domain+'/assetdevicemapper/updatemapper/',
  delete_mapper:api_domain+'/assetdevicemapper/deletemapper/',
  get_tenant_mappers:api_domain+'/assetdevicemapper/tenantmapper/',
  get_mapper_info:api_domain+'/assetdevicemapper/mapperinfo/'
}

//  commands
export const commands:any={
  post_command_add_device : api_domain+'/commands/addcommand',
  delete_command : api_domain+'/commands/deletecommand/',
  get_tenant_commands:api_domain+'/commands/tenantcommands/',
  get_Command_Info : api_domain+'/commands/commandsinfo/',
  get_device_commands : api_domain+'/commands/devicecommands/'
}

// audit logs
export const auditlogs:any={
  get_tenant_audits:api_domain+'/auditlog/tenantaudits/',
  get_plant_audits:api_domain+'/auditlog/plantaudits/'
}

// Projects
export const projects:any={
  post_project:api_domain+'/project/addproject',
  get_projects_info:api_domain+'/project/tenantproject/',
  put_projects:api_domain+'/project/updateproject/',
  delete_projects:api_domain+'/project/deleteproject/',
  project_date_info:api_domain+'/project/projectduration/',
  get_asset_projects:api_domain+'/project/assetprojects/',
  get_list_job_operators :api_domain + '/factoryusers/joboperatorlist/',
  get_job_list: api_domain +'/project/projectcodelist',
  get_job_list_jobboperators:api_domain +'/project/JobOpProjects/',
  get_projects_info_wrkcenterid:api_domain +'/project/workcentreprojects/',
  get_projects_info_plantid:api_domain +'/project/plantprojects/'
}



// simulator.
export const asset_datalog:any={
  post_asset_dlog:api_domain+'/assetdatalog/addassetdatalog'  
}

// Performance Report.
export const performenceReport:any={
  get_tenant_pf_report_table:api_domain+'/assetdatalog/assetslogdata/',
  get_plant_pf_report_table:api_domain+'/assetdatalog/plantstatus/',
  get_asset_datalog_csv:api_domain+'/assetdatalog/assetslogdatacsv/'
}


// Customer.
export const customers:any={
  post_add_customers:api_domain+'/customer/addcustomer',
  get_customer_plant_details:api_domain+'/customer/plantcustomerinfo/',
  update_customer_details:api_domain+'/customer/updatecustomer/',
  delete_customer_details:api_domain+'/customer/deletecustomer/',
  get_customer_list :api_domain+'/customer/tenantcustomerinfo/'
}


// Workorders.
export const workorders:any={
  post_work_order:api_domain+'/workorder/addworkorder',
  get_work_order_info:api_domain+'/workorder/tenantworkorders/',
  get_work_order_plant_info:api_domain+'/workorder/plantworkorders/',
  update_work_order_info:api_domain+'/workorder/updateworkorder/',
  delete_work_order:api_domain+'/workorder/deactivateworkorder/',
  workorder_performence:api_domain+'/workorder/workorderperformence/',
  get_work_order_name_list : api_domain+'/workorder/tenantwolist/',
  // added the workorder list for the dashboard
  get_dashboard_workorder_name_list : api_domain +'/workorder/tenantipwolist/',
  get_work_order_name_Plant_list : api_domain+'/workorder/planttwolist/',
  tenant_workorders_progress:api_domain+'/workorder/tenantwoprogress/',
  plant_workorders_progress:api_domain+'/workorder/ plantwoprogress/',
  get_workorder_duration:api_domain+'/workorder/workorderduration/',
  get_workorder_quantity :api_domain+'/workorder/tenantremainingworkorder/',
  get_workorder_partcode : api_domain +'/part/tenantallpartlist/'
}

// Maintenancelog.
export const maintenancelog:any={
  post_maintenancelog:api_domain+'/maintenancelog/addmaintenance',
  get_maintenancelog_info:api_domain+'/maintenancelog/allmaintenance',
  update_maintenancelog_info:api_domain+'/maintenancelog/updatemaintenance/',
  delete_maintenancelog:api_domain+'/maintenancelog/deletemaintenance/',
  get_maintenancelog_info_tenant_id:api_domain+'/maintenancelog/tenantmaintenance/',
  get_maintenancelog_info_plant_id:api_domain+'/maintenancelog/plantmaintenance/',
  get_asset_maintenance :api_domain+'/maintenancelog/assetsmaintenance/',
  }

//Factory Data Rule
export const factoryDrule:any={
  get_factory_drule:api_domain+'/factoryrules/tenantfactoryruleinfo/',
  get_factory_drule_plant_id:api_domain+'/factoryrules/plantfactoryruleinfo/',
  post_factory_drule:api_domain+'/factoryrules/addfactoryrules',
  inactive_active_factory_drule:api_domain+'/factoryrules/activatefactoryrule/',
  delete_factory_drule:api_domain+'/factoryrules/deletefactoryrule/',
  plant_factory_rule:api_domain+'/factoryrules/plantfactoryruleinfo/'
}


//  Asset Efficiency Analysis.
export const assetEfficencyAnalysis:any={
  get_todayoee:api_domain+'/assetefanalysis/todayoee/',
  get_slow_cycle:api_domain+'/assetefanalysis/slowcycle/',
  get_todayperformance:api_domain+'/assetefanalysis/todayperformance/',
  get_todayavailability:api_domain+'/assetefanalysis/todayavailability/',
  get_todayquality:api_domain+'/assetefanalysis/todayquality/',
  get_lastdaysoee:api_domain+'/assetefanalysis/lastdaysoee/',
  get_lastdaysperformance:api_domain+'/assetefanalysis/lastdaysperformance/',
  get_lastdaysavailability:api_domain+'/assetefanalysis/lastdaysavailability/',
  get_lastdaysquality:api_domain+'/assetefanalysis/lastdaysquality/',
  get_today_TB_metrics:api_domain+'/assetefanalysis/todayasseftbmtrs/',
  get_lastdaysppn:api_domain+'/assetefanalysis/lastdaysppn/',
  get_lastdaysnrr:api_domain+'/assetefanalysis/lastdaysnrr/',
  get_lastdaysftp:api_domain+'/assetefanalysis/lastdaysftp/',
  get_todayqlscp:api_domain+'/assetefanalysis/todayqlscp/',
  get_lastdaysqlyloss:api_domain+'/assetefanalysis/lastdaysqlyloss/',
  get_lastdaysperfloss:api_domain+'/assetefanalysis/lastdaysperfloss/',
  get_lastdaysavailloss:api_domain+'/assetefanalysis/lastdaysavailloss/',
  get_lastdaysrdftime:api_domain+'/assetefanalysis/lastdaysrdftime/',
  get_lastdaysqsip:api_domain+'/assetefanalysis/lastdaysqsip/',
  get_mean_Time_Between_Replacements:api_domain + '/assetefanalysis/assetMTBF/',
  get_mean_Time_To_Repair:api_domain + '/assetefanalysis/assetMTTR/',
  get_fault_trend:api_domain + '/fault/ftrend/',
}


// Asset Metrics Master.
export const assetMetricMaster:any={
  post_assetmetric:api_domain+'/assetmtrmst/addassetmetric',
  put_assetmetric:api_domain+'/assetmtrmst/updateassetmetric'
}

// Job progress.
export const jobProgessAnalysis:any={
  get_wojobprogress:api_domain+'/jobtracking/wojobprogress/',
  get_jobprogress:api_domain+'/jobtracking/jobprogress/',
  get_plant_job_progress:api_domain+'/jobtracking/plantwojobprogress/',
}


// Asset notifications.
export const assetNotifications:any={
   put_notification:api_domain+'/factorymsglog/updatemsg/',
   get_tenantmsgs:api_domain+'/factorymsglog/tenantmsgs/',
   get_plantmsgs:api_domain+'/factorymsglog/plantmsgs/',
   get_tenantthmsgs:api_domain+'/factorymsglog/tenantthmsgs/',
   get_plantthmsgs:api_domain+'/factorymsglog/plantthmsgs/',
   get_tenanttomsgs:api_domain+'/factorymsglog/tenanttomsgs/',
   get_planttomsgs:api_domain+'/factorymsglog/planttomsgs/',
   get_tenantallalts:api_domain+'/factorymsglog/tenantallalts/',  
   get_plantallalts:api_domain+'/factorymsglog/plantallalts/',
   get_tenantmsgscsv:api_domain+'/factorymsglog/tenantmsgscsv/',
   get_plantmsgscsv:api_domain+'/factorymsglog/plantmsgscsv/'
}

// Part Management.
export const PartManagement:any={
  post_part_management:api_domain+'/part/addpart',
  get_all_part_management:api_domain+'/part/tenantpart/', 
  get_Tenant_parent_part_code_list:api_domain+'/part/tenantpartlist/', 
  get_all_tenant_part_list_by_partid :api_domain+'/part/tenantallparentpartlist/',
  put_Tenant_part_by_partid: api_domain+ '/part/updatepart/',
  delete_part_by_partid : api_domain+ '/part/deletepart/'
}