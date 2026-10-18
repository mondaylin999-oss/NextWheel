import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../server.js';

test('API health, inventory, validation and draft creation', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const get = path => fetch(base + path);
  const post = body => fetch(base + '/api/listings', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  try {
    assert.equal((await (await get('/api/health')).json()).ok, true);
    const cars = await (await get('/api/cars?make=Honda&maxPrice=25000&minScore=90')).json();
    assert.equal(cars.count, 1);
    assert.equal((await get('/api/cars/999')).status, 404);
    assert.equal((await get('/api/missing')).status, 404);
    for (const query of ['maxPrice=no','minScore=101','maxPrice=-1','minScore=']) assert.equal((await get('/api/cars?' + query)).status, 400);
    const draft = {year:2021,make:' Honda ',model:'Civic',mileage:0};
    const response = await post(draft);
    assert.equal(response.status, 201);
    assert.equal((await response.json()).data.make, 'Honda');
    for (const patch of [{mileage:-1},{year:'bad'},{make:' '},{price:-20},{mileage:[]},{year:true}]) assert.equal((await post({...draft,...patch})).status,400);
    const invalid = await fetch(base + '/api/listings',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
    assert.equal(invalid.status,400);
    assert.match(invalid.headers.get('content-type'),/json/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
