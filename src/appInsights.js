import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights = null;

export const initializeAppInsights = () => {
    appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: process.env.VUE_APP_APP_INSIGHTS_KEY,
            enableAutoRouteTracking: true,
            disableFetchTracking: false,
            disableAjaxTracking: false
        }
    });
    appInsights.loadAppInsights();
};

export const trackEvent = (name, properties = {}) => {
    if (appInsights) {
        appInsights.trackEvent({ name }, properties);
    }
};

export const trackError = (error) => {
    if (appInsights) {
        appInsights.trackException({ exception: error });
    }
};
