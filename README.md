Install: <br/>
  git clone https://github.com/jonhjul/ChatClientAngular.git<br/>
  npm install && bower update<br/>
  Ef það virkar ekki vantar eitthvað af the eftirfarandi: ruby, python, Build tools vs2013,<br/>
  compass (installað með "gem install compass" þarft að hafa ruby)<br/>
  Þegar development umhverfið er komið upp:<br/>
   keyrum development server með: grunt serve  <br/>
   þýðum við kóðan með skipuninni: grunt build <br/>
  þá verður til mappan dist sem geymir minified útgáfu af appinu.<br/>
  Síðan er hægt að keyra python.exe -m SimpleHTTPServer <br/>
  úr dist möppunni.<br/>
