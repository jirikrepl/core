AT.prototype.atReCaptchaRendered = function() {
    $.getScript(`//www.google.com/recaptcha/api.js?hl=${T9n.getLanguage()}&render=${Meteor.settings.public.reCaptcha.siteKey}`);
};
