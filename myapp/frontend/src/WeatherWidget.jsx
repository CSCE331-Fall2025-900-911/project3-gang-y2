import React, { useEffect } from 'react';

const WeatherWidget = () => {
  useEffect(() => {
    // Load the external script required for the widget
    const script = document.createElement('script');
    script.src = "https://app3.weatherwidget.org/js/?id=ww_fffe431e829ff";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on unmount to prevent duplicates/memory leaks
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="weather-container" style={{ margin: '20px 0' }}>
      {/* The widget div provided in your snippet */}
      <div 
        id="ww_fffe431e829ff" 
        v='1.3' 
        loc='id' 
        a='{"t":"horizontal","lang":"en","sl_lpl":1,"ids":["wl4099"],"font":"Arial","sl_ics":"one_a","sl_sot":"fahrenheit","cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'
      >
        More forecasts: 
        <a 
          href="https://oneweather.org/new_york_city/30_days/" 
          id="ww_fffe431e829ff_u" 
          target="_blank"
          rel="noreferrer" // Added for security
        >
          NYC weather forecast 30 days
        </a>
      </div>
    </div>
  );
};

export default WeatherWidget;
