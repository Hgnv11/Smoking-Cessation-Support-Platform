import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import "./makePlan.css";
import {
  Affix,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  InputNumber,
  Radio,
  Row,
  TimePicker,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";

function MakePlan() {
  const format = "HH:mm";
  const [selectedRadio, setSelectedRadio] = useState(1);
  const currentDateTime = dayjs();

  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Make Your Quit Plan</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__content">
          <div className="wrapper__content-des">
            <h2>Introduction</h2>
            <p>
              Quitting all tobacco products is the best thing you can do for
              your health. Whether you smoke cigarettes, vape, or do both,
              creating a personalized quit plan makes it easier to stay on
              track, get through hard times, and quit for good.
            </p>
          </div>
          <Divider className="divider" />
          <div className="wrapper__content-step">
            <h2>Step 1</h2>
            <h2 className="wrapper__content-step-title">Set Your Quit Date</h2>
            <p>
              Choose a date within the next two weeks to quit smoking. This
              gives you enough time to prepare but is close enough to keep you
              motivated.
            </p>
            <Radio.Group
              name="radiogroup"
              value={selectedRadio}
              onChange={handleRadioChange}
              options={[
                { value: 1, label: "Now" },
                { value: 2, label: "Choose date time" },
              ]}
            />
            <div className="wrapper__content-step-datetimepicker">
              <DatePicker
                variant="filled"
                className="wrapper__content-step-date"
                needConfirm
                disabled={selectedRadio === 1}
                value={selectedRadio === 1 ? currentDateTime : undefined}
              />
              <TimePicker
                variant="filled"
                classNames="wrapper__content-step-time "
                format={format}
                disabled={selectedRadio === 1}
                value={selectedRadio === 1 ? currentDateTime : undefined}
              />
            </div>
          </div>
          <div className="wrapper__content-step">
            <h2>Step 2</h2>
            <h2 className="wrapper__content-step-title">
              What Is Smoking Costing You ?
            </h2>
            <p>
              Enter how many cigarettes you smoke and how much a pack of
              cigarettes costs. You'll find out how much money you can save by
              quitting.
            </p>
            <div className="wrapper__content-step-cost">
              <div className="wrapper__content-step-cost-item">
                <h3>I smoke about</h3>
                <InputNumber
                  min={0}
                  variant="filled"
                  id="cigarettesPerDay"
                  className="wrapper__content-step-cost-input"
                />
                <h3>cigarettes each day</h3>
              </div>
              <div className="wrapper__content-step-cost-item">
                <h3>I spend about $</h3>
                <InputNumber
                  min={0}
                  variant="filled"
                  id="cigarettesPerDay"
                  className="wrapper__content-step-cost-input"
                />
                <h3>per pack of cigarettes</h3>
              </div>
              <div className="wrapper__content-step-cost-item">
                <h3>A pack contains</h3>
                <InputNumber
                  min={0}
                  variant="filled"
                  id="cigarettesPerDay"
                  className="wrapper__content-step-cost-input"
                />
                <h3>cigarettes</h3>
              </div>
            </div>
          </div>
          <div className="wrapper__content-step">
            <h2>Step 3</h2>
            <h2 className="wrapper__content-step-title">
              Why Are You Quitting ?
            </h2>
            <p>
              Knowing your reasons for why you want to quit smoking can help you
              stay motivated and on track, especially in difficult moments.
            </p>
            <Checkbox.Group className="wrapper__content-step-reason">
              <Row>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="It is affecting my health"
                  >
                    It is affecting my health
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="For my family or friends"
                  >
                    For my family or friends
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="My doctor recommended quitting"
                  >
                    My doctor recommended quitting
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="To save money"
                  >
                    To save money
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="Baby on the way"
                  >
                    Baby on the way
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="To set a good example"
                  >
                    To set a good example
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="To have a better future"
                  >
                    To have a better future
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    className="wrapper__content-step-reason-checkbox"
                    value="To take back control"
                  >
                    To take back control
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </div>
        </div>
        <Button type="primary" className="wrapper__btn">
          Create Plan
        </Button>
      </div>
      <Footer />
    </>
  );
}

export default MakePlan;
