# Grafana + InfluxDb sample project with optional support for input data from PS3 Dualshock Gyroscope

## Details
1. Docker-compose is used to bring up instances of Grafana and InfluxDb
2. Grafana/InfluxDb need to be configured manually (see scripts.txt)
3. dualsock-input contains a nodeJs app which reads gyroscope events from paired PS3 Dualshock controller and sends the data to InfluxDB
