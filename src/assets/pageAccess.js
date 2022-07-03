const userModuleRoutes = [
  "/",
  "dashboard",
  "assets",
  "assets/category",
  "assets/listing",
  "account",
  "user",
  "user/listing",
  "user/report",
  "enquiry",
  "enquiry/listing",
  "enquiry/report",
  "bookings",
  "bookings/listing",
  "bookings/report",
  "bookings/details/:id",
  "destinations",
  "destinations/listing",
  "destinations/details/:id",
  "packages",
  "packages/listing",
  "packages/details/:id",
  "customers",
  "customers/listing",
  "customers/report",
  "tags",
  "tags/listing",
  "tags/report",
  "enquiry/:id",
  "customers",
  "customers/listing",
  "cms",
  "standard-data",
  "standard-data/country",
  "standard-data/tagcategory",
];

const userPageAccess = [
  {
    userType: "U",
    route: [
      {
        userRole: "Superadmin",
        excludeRoutes: [
        ],
        includeRoutes: [
          "configurations",
          "privilege",
        ]
      },
      {
        userRole: "Admin",
        excludeRoutes: [

        ],
        includeRoutes: [
          "configurations"
        ]
      }
    ]
  }
];

export {
  userPageAccess,
  userModuleRoutes
};
