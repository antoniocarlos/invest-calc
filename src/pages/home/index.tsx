import React, { useRef, useState, useCallback } from 'react';
import api from '../../services/api';
import { differenceInDays, endOfHour } from 'date-fns'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Finance } from 'financejs'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import dateRange from '../../utils/dateRange';
import { useToast } from '../../hooks/toast';

import ComponenteNavbar from '../../components/Navbar';
import ComponenteFooter from '../../components/Footer';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Charts from '../../components/Charts';

import 'react-day-picker/lib/style.css';
import './styles.css';


interface State {
  data: Array<Array<string | Date | number>>;
}

interface IResponse {
  time: number;
  close: number;
}

interface ICalculateFormData {
  investType: string[];
  investDate: Date;
  investValue: number;
}

const Home: React.FC = () => {

  const formRef = useRef<FormHandles>(null);

  const finance = new Finance();

  const [investType, setInvestType] = useState([0]);
  const [investDate, setInvestDate] = useState(new Date());
  const [investValue, setInvestValue] = useState(0);

  const [formattedChartData, setFormattedChartData] = useState<State>(() => {
    const interData: State = { data: [['Data', 'investimento'], [new Date(), 0],] };
    return interData;
  });

  const { addToast } = useToast();

  const handleCalculate = useCallback(
    async (data: ICalculateFormData) => {
      try {

        let flag = true;

        if (investDate.getDate() === new Date().getDate()) {
          flag = false;
          addToast({
            type: 'error',
            title: 'Erro de preenchimento do formulário',
            description:
              'Escolha uma data para a simulação',
          });
        }

        if (investValue === 0 || typeof investValue !== 'number') {
          flag = false;
          addToast({
            type: 'error',
            title: 'Erro de preenchimento do formulário',
            description:
              'Preencha o valor investido apenas com números',
          });
        }

        if (flag) {
          let formattedTreasureData: State = { data: [['0', 0]] };
          let formattedCryptoData: State = { data: [['0', 0]] };

          if (investType.includes(1)) {

            const datesTreasure = dateRange(investDate, new Date());

            const initialInvest = investValue;

            const chartDataTreasure: Array<Array<string | Date | number>> = datesTreasure.map((data, index) => {
              const investValue = finance.CI(0.166, index + 1, initialInvest, index + 1);

              const chartData_ =
                [
                  data,
                  investValue,
                ]
                ;

              return chartData_;
            });

            const axes = ['data', 'Tesouro direto'];

            formattedTreasureData = { data: [axes, ...chartDataTreasure] };

            setFormattedChartData(formattedTreasureData);
          }

          if (investType.includes(0)) {

            let limit = 0;
            let aggregate = 1;

            const investDays = differenceInDays(endOfHour(new Date()), endOfHour(investDate));

            limit = investDays;

            const response = await api.get('/data/v2/histoday', {
              params: {
                fsym: 'BTC',
                tsym: 'BRL',
                limit,
                aggregate,
                e: 'CCCAGG',
              }
            });

            const chartData: Array<Array<string | Date | number>> = response.data.Data.Data.map((data: IResponse) => {

              const chartData_ =
                [
                  new Date(data.time * 1000),
                  data.close,
                ]
                ;

              return chartData_;
            });

            const formattedChartData = { data: [...chartData] };

            // Calculate cryptocoin investiment
            const baseValue = investValue / Number(formattedChartData.data[0][1]);

            const cryptoData = formattedChartData.data.map((data) => {
              const value = baseValue * Number(data[1]);
              const chartData_ =
                [
                  data[0],
                  value
                ]
                ;

              return chartData_;
            });

            const axes = ['data', 'bitcoin'];

            formattedCryptoData = { data: [axes, ...cryptoData] };

            setFormattedChartData(formattedCryptoData);
          }

          if (investType.includes(0) && investType.includes(1)) {

            const formattedData = formattedTreasureData.data.map((data, index) => {
              if (formattedCryptoData.data[index]) {
                const cell = data;
                cell.push(formattedCryptoData.data[index][1]);
                return cell;
              } else {
                const cell = data;
                cell.push(formattedCryptoData.data[index - 1][1]);
                return cell;
              }
            }
            );

            const response = { data: [...formattedData] };
            console.log(response);


            setFormattedChartData(response);
          }
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro no servidor',
          description:
            'Ocorreu um erro ao tentar coletar a cotação',
        });
      }
    },
    [investDate, investValue, investType, setFormattedChartData, addToast, finance]);

  const handleUpdateDate = useCallback((day: Date) => {
    setInvestDate(day);
  }, []);

  const handleUpdateInvestValue = useCallback((value: number) => {
    setInvestValue(value);
  }, []);

  const handleUpdateInvestType = useCallback((value: number[]) => {
    setInvestType(value);
  }, []);

  return (
    <Container fluid>
      <ComponenteNavbar />
      <Row className="invest">
        <Col md="4" className="text-center">
          <div className="form-content">
            <Form ref={formRef} onSubmit={handleCalculate}>
              <h3 className="form-title">Calculadora de investimentos</h3>

              <OverlayTrigger
                placement={'top'}
                overlay={
                  <Tooltip id={'tooltip-top'}>
                    Marque o tipo de investimento.
                    </Tooltip>
                }
              >
                <ToggleButtonGroup type="checkbox" value={investType} onChange={type => handleUpdateInvestType(type)}>

                  <ToggleButton value={0}>Bitcoin</ToggleButton>
                  <ToggleButton value={1}>Tesouro direto</ToggleButton>
                </ToggleButtonGroup>
              </OverlayTrigger>

              <OverlayTrigger
                placement={'top'}
                overlay={
                  <Tooltip id={'tooltip-top'}>
                    Data de realização do investimento.
                  </Tooltip>
                }
              >
                <div className="input-group mb-3 ">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Data: </span>
                  </div>
                  <DayPickerInput inputProps={{ className: 'input-group form-control' }} onDayChange={day => handleUpdateDate(day)} />
                </div>
              </OverlayTrigger>

              <OverlayTrigger
                placement={'top'}
                overlay={
                  <Tooltip id={'tooltip-top'}>
                    Valor investido em reais.
                  </Tooltip>
                }
              >
                <InputGroup className="mb-3 ">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">R$</InputGroup.Text>
                  </InputGroup.Prepend>

                  <FormControl
                    type="number"
                    aria-label="Valor investido"
                    placeholder="Valor investido"
                    onChange={(value) => handleUpdateInvestValue(Number(value.target.value))}
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>.00</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </OverlayTrigger>

              <Button type="submit" block>
                Calcular
            </Button>
            </Form>
          </div>

        </Col>

        <Col md="8">
          <div className="chart-container">
            <Charts data={formattedChartData.data} />
          </div>
        </Col>
      </Row>
      <ComponenteFooter />

    </Container>
  );
}

export default Home;
