const { LineBot, LineHandler } = require('bottender');
const { createServer } = require('bottender/express');

const PORT = process.env.PORT || 5000;
const config = require('./bottender.config');
const action = require('./action');
const send = require('./send');

const bot = new LineBot(config.line);

bot.setInitialState({
  asking: false,
  nickname: null,
  askingSearchString: false,
  searchString: null,
});

// FIXME: remove lots of ifelse
const handler = new LineHandler().onEvent(async context => {
  if (context.state.nickname === null) {
    await send.askNickname(context);
  } else if (context.state.askingSearchString === true) {
    await send.specialGIF(context);
  } else if (context.event.isPostback) {
    await action.whatType(context);
  } else {
    await context.sendText(`I don't understand.`);
  }
});
// .onError(async context => {
//   await context.sendText('Something wrong happened.');
// });

// if (context.event.isText) {
//   const { text } = context.event.message;
//   if (/^random/i.test(text)) await helper.sendRandomGIF(context, gif);
//   else if (/^show/i.test(text)) await helper.showCarousel(context);
//   else context.sendText(`I don't understand.`);
// }

bot.onEvent(handler);

const server = createServer(bot);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
