const Hapi = require('@hapi/hapi');
const axios = require("axios");

const text = `Thanks for calling #OxygenWarRoom @ Delhi

We are a community-run initiative trying to lend oxygen cylinders to very critical patients for 12 hour durations.
Please fill in your requirements on the link below and we will get back to you within 30 minutes. https://oxygen-war-room.glideapp.io/`

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        let callFrom = request.query.CallFrom;
        callFrom = callFrom.slice(1,);
        const finalCallFrom = `91${callFrom}`;
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${callFrom}&text=${encodeURIComponent(text)}&app_absent=0`
        const smsUrl = `https://www.t2ll.com/smsRedirect.aspx/?phoneNumber=918130378953&msg=${encodeURIComponent(text)}`
          axios.post('https://sheetdb.io/api/v1/1felxptln5fa7?sheet=PendingMessages', {
            data: { Number: callFrom, "Whatsapp Link": whatsappUrl, "SMS Link": smsUrl, "Added On": new Date() }
          }).then(d => console.log(d)).catch(e => console.log(e));
          return {success: true};
      }
  });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();