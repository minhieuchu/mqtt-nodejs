import mqtt, { MqttClient } from "mqtt";
import { DataPointModel, DeviceModel } from "./types";
import { randInteger } from "./utils";

const DEVICE_TOPIC = "/device/6f9ea7c7-6297-4283-b72d-7d673d3473fd";
const TEMPERATURE_TOPIC = DEVICE_TOPIC + "/Temperature";

const host = "broker.emqx.io";
const port = 8083;
const url = `ws://${host}:${port}/mqtt`;
const options = {
  clean: true,
  connectTimeout: 5 * 1000,
  reconnectPeriod: 1000,
};
const intervalTimeout = 3000;

const mqttClient = mqtt.connect(url, options) as MqttClient;

mqttClient.on("connect", () => {
  console.log("Mqtt Connected");

  const initDeviceModelPayload = {
    device_id: "6f9ea7c7-6297-4283-b72d-7d673d3473fd",
    device_name: "Tank",
  };
  const initDataPointModelPayload = {
    device_id: "6f9ea7c7-6297-4283-b72d-7d673d3473fd",
    sensor_name: "Temperature",
    unit: "°C",
  };

  mqttClient.subscribe([DEVICE_TOPIC, TEMPERATURE_TOPIC], { qos: 0 }, (err) => {
    if (!err) {
      setInterval(() => {
        // Publish Device model
        const deviceModelPayload: DeviceModel = {
          ...initDeviceModelPayload,
          status: !!Math.round(Math.random()),
        };
        mqttClient.publish(
          DEVICE_TOPIC,
          JSON.stringify(deviceModelPayload),
          { qos: 0 },
          (error) => {
            if (error) {
              console.error(error);
            }
          }
        );

        // Publish DataPoint model
        const dataPointModelPayload: DataPointModel = {
          ...initDataPointModelPayload,
          value: randInteger(0, 100),
        };
        mqttClient.publish(
          TEMPERATURE_TOPIC,
          JSON.stringify(dataPointModelPayload),
          { qos: 0 },
          (error) => {
            if (error) {
              console.error(error);
            }
          }
        );
      }, intervalTimeout);
    }
  });
});
