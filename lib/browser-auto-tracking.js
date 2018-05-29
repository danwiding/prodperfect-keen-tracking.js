var pkg = require('../package.json');

function initAutoTracking(lib) {
  return function(obj) {
    var client = this;
    var helpers = lib.helpers;
    var utils = lib.utils;

    var options = utils.extend({
      ignoreDisabledFormFields: false,
      ignoreFormFieldTypes: ['password'],
      recordClicks: true,
      recordFormSubmits: true,
      recordInputChanges: false,
      recordPageUnloads: false,
      recordPageViews: true,
      recordScrollState: true
    }, obj);

    var now = new Date();

    var cookie = new utils.cookie('keen');
    var uuid = cookie.get('uuid');
    if (!uuid) {
      uuid = helpers.getUniqueId();
      cookie.set('uuid', uuid);
    }

    var session_cookie = new utils.cookie('prodperfect_session');
    var session_uuid = session_cookie.get('session_uuid');
    if (!session_uuid) {
      session_uuid = helpers.getUniqueId();
    }
    session_cookie.set('session_uuid', session_uuid);
    session_cookie.expire(1/48);

    var scrollState = {};
    if (options.recordScrollState) {
      scrollState = helpers.getScrollState();
      utils.listener('window').on('scroll', function(){
        scrollState = helpers.getScrollState(scrollState);
      });
    }

    var tracker_loaded_at_time = now.toISOString();
    var tracker_load_uuid_value = helpers.getUniqueId();

    client.extendEvents(function() {
      var browserProfile = helpers.getBrowserProfile();
      return {
        iso_time_full: new Date().toISOString(),
        local_time_full: new Date().toString(),
        session: {
          session_uuid: session_uuid
        },
        tracked_by: pkg.name + '-' + pkg.version,
        tracker_load_uuid: tracker_load_uuid_value,
        tracker_loaded_at: tracker_loaded_at_time,
        user: {
          uuid: uuid
        },
        page: {
          title: document ? document.title : null,
          description: browserProfile.description,
          time_on_page: getSecondsSinceDate(now)
        },

        ip_address: '${keen.ip}',
        geo: { /* Enriched */ },

        user_agent: '${keen.user_agent}',
        tech: {
          profile: browserProfile
          /* Enriched */
        },

        url: {
          full: window ? window.location.href : '',
          info: { /* Enriched */ }
        },

        referrer: {
          full: document ? document.referrer : '',
          info: { /* Enriched */ }
        },

        time: {
          local: { /* Enriched */ },
          utc: { /* Enriched */ }
        },

        keen: {
          timestamp: new Date().toISOString(),
          addons: [
            {
              name: 'keen:ip_to_geo',
              input: {
                ip: 'ip_address'
              },
              output : 'geo'
            },
            {
              name: 'keen:ua_parser',
              input: {
                ua_string: 'user_agent'
              },
              output: 'tech'
            },
            {
              name: 'keen:url_parser',
              input: {
                url: 'url.full'
              },
              output: 'url.info'
            },
            {
              name: 'keen:url_parser',
              input: {
                url: 'referrer.full'
              },
              output: 'referrer.info'
            },
            {
              name: 'keen:date_time_parser',
              input: {
                date_time: 'keen.timestamp'
              },
              output: 'time.utc'
            },
            {
              name: 'keen:date_time_parser',
              input: {
                date_time: 'iso_time_full'
              },
              output: 'time.local'
            }
          ],
        }
      };
    });



    if (options.recordClicks === true) {
      utils.listener('*').on('click', function(e) {
        var el = e.target;
        var props = {
          element: helpers.getDomNodeProfile(el),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('clicks', props);
      });
    }

    if (options.recordFormSubmits === true) {
      utils.listener('form').on('submit', function(e) {
        var el = e.target;
        var serializerOptions = {
          disabled: options.ignoreDisabledFormFields,
          ignoreTypes: options.ignoreFormFieldTypes
        };
        var fields = utils.serializeForm(el, serializerOptions);
        var keys = Object.keys(fields);
        for (var x = 0; x < keys.length; x++) {
          fields[keys[x]] = '---REDACTED---';
        }
        var props = {
          form: {
            action: el.action,
            fields: fields,
            method: el.method
          },
          element: helpers.getDomNodeProfile(el),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('form_submissions', props);
      });
    }

    if (options.recordInputChanges === true) {
      utils.listener('*').on('change', function (e) {
        var el = e.target;
        var props = {
          element: helpers.getDomNodeProfile(el),
          page: {
            scroll_state: helpers.getScrollState
          }
        };
        client.recordEvent('changes', props);
      });
    }

    if (options.recordPageUnloads === true && window.addEventListener) {
      window.addEventListener('beforeunload', function (e) {
        client.recordEvent('pageunloads');
      }, false);
    }

    if (options.recordPageViews === true) {
      client.recordEvent('pageviews');
    }

    return client;
  };
}

function getSecondsSinceDate(date) {
  var diff = new Date().getTime() - date.getTime();
  return Math.round(diff / 1000);
}

module.exports = initAutoTracking;
