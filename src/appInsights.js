import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights = null;

export const initializeAppInsights = () => {
    const instrumentationKey = process.env.VUE_APP_APPINSIGHTS_CONNECTION_STRING;
    appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: instrumentationKey,
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
