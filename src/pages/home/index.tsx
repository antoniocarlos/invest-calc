import React, { useRef, useEffect, useState, useCallback } from 'react';
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
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';

import mixChartData from '../../utils/mixChartData';
import dateRange from '../../utils/dateRange';
import { useToast } from '../../hooks/toast';

import ComponenteNavbar from '../../components/Navbar';
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

  const [investType, setInvestType] = useState([1]);
  const [investDate, setInvestDate] = useState(new Date());
  const [investValue, setInvestValue] = useState(0);
  const [currency, setCurrency] = useState('R$');
  // const [rawChartData, setRawChartData] = useState<State>(() => {
  //   const interData: State = { data: [['X', 'Y'], ['0', 0],] };
  //   return interData;
  // });

  const [cryptoChartData, setCryptoChartData] = useState<State>(() => {
    const interData: State = { data: [['X', 'Y'], ['0', 0],] };
    return interData;
  });

  const [tesouroChartData, setTesouroChartData] = useState<State>(() => {
    const interData: State = { data: [['X', 'Y'], ['0', 0],] };
    return interData;
  });

  const [formattedChartData, setFormattedChartData] = useState<State>(() => {
    const interData: State = { data: [['X', 'Y'], ['0', 0],] };
    return interData;
  });

  const [tsym, setTsym] = useState('BRL');
  const [fsym, setfsym] = useState('BTC');

  const { addToast } = useToast();

  const handleCalculate = useCallback(
    async (data: ICalculateFormData) => {
      try {
        formRef.current?.setErrors({});

        let formattedTreasureData: State = { data: [['0', 0]] };
        let formattedCryptoData: State = { data: [['0', 0]] };

        if (investType.includes(2)) {

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

          setTesouroChartData(formattedTreasureData);
          setFormattedChartData(formattedTreasureData);
        }

        if (investType.includes(1)) {

          let limit = 0;
          let aggregate = 1;

          const investDays = differenceInDays(endOfHour(new Date()), endOfHour(investDate));

          limit = investDays;

          const response = await api.get('/data/v2/histoday', {
            params: {
              fsym,
              tsym,
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

          // const formatted = { data: [axes, ...chartData] };

          const formattedChartData = { data: [...chartData] };

          // setRawChartData(formattedChartData);

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

          setCryptoChartData(formattedCryptoData);
          setFormattedChartData(formattedCryptoData);
        }

        if(investType.includes(1) && investType.includes(2)){

          const formattedData = formattedTreasureData.data.map((data, index) => {
            if (formattedCryptoData.data[index]) {
              const cell = data;
              cell.push(formattedCryptoData.data[index][1]);
              return cell;
            } else {
              const cell = data;
              cell.push(formattedCryptoData.data[index-1][1]);
              return cell;
            }
          }
          );

          const response = { data: [...formattedData] };
          console.log(response);


          setFormattedChartData(response);
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
    [investDate, investValue, investType, setTesouroChartData, setCryptoChartData, setFormattedChartData, formattedChartData, tesouroChartData, cryptoChartData]);


  const handleFsym = useCallback((fsymValue: string) => {
    setfsym(fsymValue);
  }, []);

  const handleTsym = useCallback((tsymValue: string) => {
    setTsym(tsymValue);
  }, []);

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
          <Form ref={formRef} onSubmit={handleCalculate}>
            <h2>Escolha um investimento</h2>


            <ToggleButtonGroup type="checkbox" value={investType} onChange={type => handleUpdateInvestType(type)}>
              <ToggleButton value={1}>Bitcoin</ToggleButton>
              <ToggleButton value={2}>Tesouro direto</ToggleButton>
            </ToggleButtonGroup>

            <div className="input-group mb-3 custom-invest-data-inputs">
              <div className="input-group-prepend">
                <span className="input-group-text">Data do investimento: </span>
              </div>
              <DayPickerInput inputProps={{ className: 'input-group form-control' }} onDayChange={day => handleUpdateDate(day)} />
            </div>


            <InputGroup className="mb-3">
              <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={currency}
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={() => { setCurrency('R$') }}>R$</Dropdown.Item>
                <Dropdown.Item onClick={() => { setCurrency('US$') }}>US$</Dropdown.Item>

              </DropdownButton>

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


            <Button type="submit">
              Calcular
            </Button>
          </Form>
        </Col>

        <Col md="8">
          <Charts data={formattedChartData.data} />
        </Col>
      </Row>

    </Container>
  );
}

export default Home;
