const nconf = require('nconf');
const sg = require('sendgrid')(nconf.get('SENDGRID_API_KEY'));
const helper = require('sendgrid').mail;

function sendMail(recipients, subject, mailTemplate, options, bccrecipients) {
  options = options || {};
  options.contentType = options.contentType || 'text/plain';
  // Creating mail object
  const mail = new helper.Mail();

  const fromEmail = new helper.Email('support@xwapp.com', 'Xwapp Support');
  mail.setFrom(fromEmail);

  mail.setSubject(subject);

  const personalization = new helper.Personalization();

  if (recipients.constructor === Array) {
    recipients.forEach((recipient) => {
      personalization.addTo(new helper.Email(recipient));
    });
  } else {
    personalization.addTo(new helper.Email(recipients));
  }
  if (bccrecipients) {
    if (bccrecipients.constructor === Array) {
      bccrecipients.forEach((bccrecipients) => {
        personalization.addBcc(new helper.Email(bccrecipients));
      });
    } else {
      personalization.addBcc(new helper.Email(bccrecipients));
    }
  }

  mail.addPersonalization(personalization);

  const content = new helper.Content(options.contentType, mailTemplate);
  mail.addContent(content);


  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  return sg.API(request).then((response) => {
    logger.info(response.statusCode);
    logger.info(response.body);
    logger.info(response.headers);
    return response;
  });
}

module.exports = {
  sendMail,
};