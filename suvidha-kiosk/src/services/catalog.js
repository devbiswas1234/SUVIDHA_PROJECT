export const SERVICES = {
  electricity: [
    {
      id: "elec_pay_bill",
      labelKey: "svcElectricityPayBill",
      slaHours: 1,
      fields: [
        { key: "consumerNumber", labelKey: "consumerNumber", placeholderKey: "enterConsumerNumber", required: true },
        { key: "amount", labelKey: "amount", placeholderKey: "enterAmount", required: true },
      ],
    },
    {
      id: "elec_new_connection",
      labelKey: "svcElectricityNewConnection",
      slaHours: 72,
      fields: [
        { key: "fullName", labelKey: "fullName", placeholderKey: "enterFullName", required: true },
        { key: "address", labelKey: "address", placeholderKey: "enterAddress", required: true },
        { key: "load", labelKey: "loadRequirement", placeholderKey: "enterLoad", required: true },
      ],
    },
    {
      id: "elec_outage",
      labelKey: "svcElectricityOutageComplaint",
      slaHours: 12,
      fields: [
        { key: "area", labelKey: "area", placeholderKey: "enterArea", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "elec_meter_reading",
      labelKey: "svcElectricityMeterReading",
      slaHours: 24,
      fields: [
        { key: "consumerNumber", labelKey: "consumerNumber", placeholderKey: "enterConsumerNumber", required: true },
        { key: "reading", labelKey: "meterReading", placeholderKey: "enterMeterReading", required: true },
      ],
    },
  ],

  gas: [
    {
      id: "gas_pay_bill",
      labelKey: "svcGasPayBill",
      slaHours: 1,
      fields: [
        { key: "gasId", labelKey: "gasConnectionId", placeholderKey: "enterGasId", required: true },
        { key: "amount", labelKey: "amount", placeholderKey: "enterAmount", required: true },
      ],
    },
    {
      id: "gas_new_connection",
      labelKey: "svcGasNewConnection",
      slaHours: 96,
      fields: [
        { key: "fullName", labelKey: "fullName", placeholderKey: "enterFullName", required: true },
        { key: "address", labelKey: "address", placeholderKey: "enterAddress", required: true },
      ],
    },
    {
      id: "gas_leakage",
      labelKey: "svcGasLeakageComplaint",
      slaHours: 4,
      fields: [
        { key: "location", labelKey: "location", placeholderKey: "enterLocation", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "gas_refill",
      labelKey: "svcGasRefillBooking",
      slaHours: 48,
      fields: [
        { key: "gasId", labelKey: "gasConnectionId", placeholderKey: "enterGasId", required: true },
        { key: "deliveryAddress", labelKey: "deliveryAddress", placeholderKey: "enterAddress", required: true },
      ],
    },
  ],

  municipal: [
    {
      id: "mun_water_complaint",
      labelKey: "svcMunicipalWaterComplaint",
      slaHours: 24,
      fields: [
        { key: "ward", labelKey: "ward", placeholderKey: "enterWard", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "mun_waste_complaint",
      labelKey: "svcMunicipalWasteComplaint",
      slaHours: 24,
      fields: [
        { key: "zone", labelKey: "zone", placeholderKey: "enterZone", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "mun_street_light",
      labelKey: "svcMunicipalStreetLightComplaint",
      slaHours: 36,
      fields: [
        { key: "poleNumber", labelKey: "poleNumber", placeholderKey: "enterPoleNumber", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "mun_pothole",
      labelKey: "svcMunicipalPotholeComplaint",
      slaHours: 72,
      fields: [
        { key: "location", labelKey: "location", placeholderKey: "enterLocation", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "mun_property_tax",
      labelKey: "svcMunicipalPropertyTax",
      slaHours: 1,
      fields: [
        { key: "propertyId", labelKey: "propertyId", placeholderKey: "enterPropertyId", required: true },
        { key: "amount", labelKey: "amount", placeholderKey: "enterAmount", required: true },
      ],
    },
    {
      id: "mun_birth_cert",
      labelKey: "svcMunicipalBirthCertificate",
      slaHours: 120,
      fields: [
        { key: "childName", labelKey: "childName", placeholderKey: "enterChildName", required: true },
        { key: "dob", labelKey: "dateOfBirth", placeholderKey: "enterDOB", required: true },
      ],
    },
    {
      id: "mun_death_cert",
      labelKey: "svcMunicipalDeathCertificate",
      slaHours: 120,
      fields: [
        { key: "personName", labelKey: "personName", placeholderKey: "enterPersonName", required: true },
        { key: "dod", labelKey: "dateOfDeath", placeholderKey: "enterDOD", required: true },
      ],
    },
    {
      id: "mun_trade_license",
      labelKey: "svcMunicipalTradeLicense",
      slaHours: 168,
      fields: [
        { key: "businessName", labelKey: "businessName", placeholderKey: "enterBusinessName", required: true },
        { key: "address", labelKey: "address", placeholderKey: "enterAddress", required: true },
      ],
    },
    {
      id: "mun_drainage",
      labelKey: "svcMunicipalDrainageComplaint",
      slaHours: 24,
      fields: [
        { key: "ward", labelKey: "ward", placeholderKey: "enterWard", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
    {
      id: "mun_toilet",
      labelKey: "svcMunicipalPublicToiletComplaint",
      slaHours: 12,
      fields: [
        { key: "location", labelKey: "location", placeholderKey: "enterLocation", required: true },
        { key: "details", labelKey: "details", placeholderKey: "describeIssue", required: true, type: "textarea" },
      ],
    },
  ],
};
