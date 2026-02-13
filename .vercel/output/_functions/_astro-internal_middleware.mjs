import 'es-module-lexer';
import './chunks/astro-designed-error-pages_KZPB8QRS.mjs';
import 'kleur/colors';
import './chunks/astro/server_B7CNsfjb.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_DugXoN1G.mjs';

const onRequest$1 = async (ctx, next) => {
  const { request } = ctx;
  new URL(request.url);
  return next();
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
