const sidebarRoutes = [
  {
    userType: "U",
    route: [
      {
        url: "dashboard",
        label: "Dashboard",
        icon: "uil uil-home-alt",
      },
      {
        label: "DAM",
        icon: "uil uil-books",
        items: [
          {
            url: "assets/listing",
            label: "Asset",
            icon: "uil uil-books",
          },
          {
            label: "Asset Categories",
            url: "assets/category",
            icon: "uil uil-layer-group",
          }
        ]
      },
      {
        label: "Bookings",
        icon: "uil uil-file-landscape-alt",
        items: [
          {
            url: "bookings/listing",
            label: "Manage Bookings",
            icon: "uil uil-layer-group",
          },
          {
            label: "Download Bookings",
            url: "bookings/report",
            icon: "uil uil-layer-group",
          }
        ]
      },
      {
        label: "Enquires",
        icon: "uil uil-envelopes",
        items: [
          {
            label: "Manage Enquires",
            url: "enquiry/listing",
            icon: "uil uil-layer-group",
          },
          {
            label: "Download Reports",
            url: "enquiry/report",
            icon: "uil uil-layer-group",
          }
        ]
      },
      {
        url: "packages/listing",
        label: 'Packages',
        icon: "uil uil-layer-group",
      },
      {
        url: "destinations/listing",
        label: 'Destinations',
        icon: "uil uil-university",
      },
      {
        label: "Tags",
        icon: "uil uil-label-alt",
        url: "tags/listing",
      },
      {
        url: "cms",
        label: "CMS",
        icon: "uil uil-document-layout-center",
      },
      {
        label: 'Customers',
        icon: "uil uil-users-alt",
        items: [
          {
            label: "Manage Customers",
            url: "customers/listing",
            icon: "uil uil-layer-group",
          },
          {
            label: "Download Customers",
            url: "customers/report",
            icon: "uil uil-layer-group",
          }
        ]
      },
      {
        label: "Standard Data",
        icon: "uil uil-database",
        items: [
          {
            url: "standard-data/tagcategory",
            label: 'Manage Tag Categories',
            icon: "uil uil-label-alt",
          },
          {
            url: "standard-data/country",
            label: 'Manage Country',
            icon: "uil uil-location-arrow",
          },
        ]
      },
      {
        label: "Admin Users",
        icon: "uil uil-users-alt",
        url: "user/listing",
      }
    ]
  }
];

export {
  sidebarRoutes
};
