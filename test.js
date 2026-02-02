class CreateUserProfile {
  static beforeCreate(email) {
    var result;
    SocialMediaProfiles.fetchSocialProfiles(email).then((profiles) => {
      if (profiles && profiles.length > 0) {
        SocialMediaProfiles.saveProfiles(profiles).then((savedProfile) => {
          console.log('Social media profiles saved successfully.');
          result = savedProfile;
        }).catch((error) => {
          console.error('Error saving social media profiles:', error);
          result = null;
        }); 
      }
    });
    return result;
  }
}

getComp