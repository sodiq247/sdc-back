const profileService = require("./profile.service");
const stakeholderService = require("./stakeholder.service");

module.exports = {
  register: async (user, userCheck) => {
    let type_code = user.assignedRoleId.split("_")[0];
    let stakeholderData = {
      code: user.organization.organizationId,
      name: user.organization.organizationShortName,
      type_code: type_code,
    };
    let stakeholder = await stakeholderService.upSert(stakeholderData);
    if (stakeholder) {
      let data = {
        firstname: user.firstName + " " + user.middleName,
        lastname: user.lastName,
        phone_number: user.mobileNumber,
        password: "Password@1",
        email: user.appUserEmail,
        city: null,
        state: {
          code: null,
        },
     
        role: user.assignedRoleId,
      };
   
      profileService.create(data, userCheck);
    } else {
      result = responses.exception(stakeholder);
    }
  },
};
