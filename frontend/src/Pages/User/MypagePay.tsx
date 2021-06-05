import React, { useEffect, useState } from 'react';

import { getDateString } from '../../Function';
import { UserBookPayType, UserProductPayType } from '../../Main/Type';

import axios from 'axios';
import { SERVER_URL } from '../../CommonVariable';
import { errorHandler } from '../../Main/ErrorHandler';
import { useTokenState } from '../../Main/TokenModel';
import { Button, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField } from '@material-ui/core';
import { useUserState } from '../../Main/UserModel';

type Props = {
	mode: number
}

const MypagePay = ({ mode }: Props) => {
	const userId = useUserState();
	const AUTH_TOKEN = useTokenState();

	const [payMode, setPayMode] = useState<number>(0); // 0 : 예매 결제, 1: 상품 결제

	/* 날짜 */
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	/* 정보 저장 */
	const [bookPayInfo, setBookPayInfo] = useState<UserBookPayType[] | undefined>(undefined);
	const [productPayInfo, setProductPayInfo] = useState<UserProductPayType[] | undefined>(undefined);

	useEffect(() => {
		if (mode !== 1)
			return;
		fetchFromMode();
	}, [mode, payMode]);

	const handleModeChange = (e: any, newValue: number) => {
		setPayMode(newValue);
	}

	/* 정보 받아오기 */
	const fetchFromMode = () => {
		if (payMode) {
			fetchUserProductPayList();
		} else {
			fetchUserBookPayList();
		}
	}

	const fetchUserBookPayList = () => {
		axios.post(`${SERVER_URL}/pay/book/list`, {
			"page": 1,
			"amount": 30,
			"user_id": userId,//145,
			"start_date": startDate === "" ? null : startDate,
			"end_date": endDate === "" ? null : endDate,
		}, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				if (!res.data || !res.data.bookpayinfo)
					return;
				setBookPayInfo(res.data.bookpayinfo);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const fetchUserProductPayList = () => {
		axios.post(`${SERVER_URL}/pay/product/list`, {
			"page": 1,
			"amount": 30,
			"user_id": userId,//145,
			"start_date": startDate === "" ? null : startDate,
			"end_date": endDate === "" ? null : endDate,
		}, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				if (!res.data || !res.data.prodpayinfo)
					return;
				setProductPayInfo(res.data.prodpayinfo);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	/* 코드 사용 */
	const usePayCode = (use_code: string) => {
		if (!confirm("사용하시겠습니까? 사용한 내역은 돌이킬 수 없습니다."))
			return;

		axios.post(`${SERVER_URL}/pay/use/book`, {
			"use_code": use_code
		}, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				alert("사용 완료 되었습니다.")
				fetchUserBookPayList();
			})
			.catch((e) => {
				errorHandler(e, true);
			});

	}
	const useProductCode = (use_code: string) => {
		if (!confirm("사용하시겠습니까? 사용한 내역은 돌이킬 수 없습니다."))
			return;

		axios.post(`${SERVER_URL}/pay/use/product`, {
			"use_code": use_code
		}, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				alert("사용 완료 되었습니다.")
				fetchUserProductPayList();
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const getTableHeader = () => (
		<TableHead>
			<TableRow>
				<TableCell>번호</TableCell>
				<TableCell>결제 내용</TableCell>
				<TableCell>결제 정보</TableCell>
				<TableCell>결제 상태</TableCell>
				<TableCell>사용 정보</TableCell>
			</TableRow>
		</TableHead>
	);

	return (
		<div className="user-pay-con">
			<div className="select-date-con">
				<div>결제 일자 별 검색</div>
				<TextField
					type="date"
					label="시작일자"
					value={getDateString(startDate)}
					InputLabelProps={{
						shrink: true
					}}
					onChange={(e: any) => setStartDate(e.target.value.split('-').join(''))}
				/>
				<TextField
					type="date"
					label="종료일자"
					value={getDateString(endDate)}
					InputLabelProps={{
						shrink: true
					}}
					onChange={(e: any) => setEndDate(e.target.value.split('-').join(''))}
				/>
				<Button variant="contained" color="primary" onClick={fetchFromMode}>검색</Button>
			</div>
			<div>
				<Tabs
					value={payMode}
					onChange={handleModeChange}
					className="pay-tab"
					indicatorColor="primary"
				>
					<Tab label="예매결제조회" />
					<Tab label="상품결제조회" />
				</Tabs>
				<div
					role="tabpanel"
					hidden={payMode !== 0}
				>
					{/* 예매 */}
					{
						bookPayInfo &&
						<TableContainer>
							<Table>
								{getTableHeader()}
								<TableBody>
									{
										bookPayInfo.map((book: UserBookPayType, index: number) => {
											return (
												<TableRow key={book.book_pay_id}>
													<TableCell>{index}</TableCell>
													<TableCell>결제 내용</TableCell>
													<TableCell>
														<div>
															<div>결제 가격 : {book.price}</div>
															<div>결제 종류 : {book.pay_type}</div>
															<div>결제 일자 : {book.pay_datetime}</div>
															<div>사용 포인트 : {book.use_point}</div>
															<div>적립 포인트 : {book.accu_point}</div>
														</div>
													</TableCell>
													<TableCell>
														{
															book.use_datetime === null ?
																<Button variant="contained" color="secondary" onClick={() => usePayCode(book.use_code)}>사용하기</Button> :
																<Button variant="contained" color="default">이미 사용됨</Button>
														}
													</TableCell>
													<TableCell>
														<div>
															<div>사용 일자 : {book.use_datetime}</div>
															<div>사용 코드 : {book.use_code}</div>
														</div>
													</TableCell>
												</TableRow>
											);
										})
									}
								</TableBody>
							</Table>
						</TableContainer>
					}
				</div>
				<div
					role="tabpanel"
					hidden={payMode !== 1}
				>
					{/* 상품 */}
					{
						productPayInfo &&
						<TableContainer>
							<Table>
								{getTableHeader()}
								<TableBody>
									{
										productPayInfo.map((product: UserProductPayType, index: number) => {
											return (
												<TableRow key={product.prod_pay_id}>
													<TableCell>{index}</TableCell>
													<TableCell>결제 내용</TableCell>
													<TableCell>
														<div>
															<div>결제 가격 : {product.price}</div>
															<div>결제 종류 : {product.pay_type}</div>
															<div>결제 일자 : {product.pay_datetime}</div>
															<div>사용 포인트 : {product.use_point}</div>
															<div>적립 포인트 : {product.accu_point}</div>
														</div>
													</TableCell>
													<TableCell>

														{
															product.use_datetime === null ?
																<Button variant="contained" color="secondary" onClick={() => useProductCode(product.use_code)}>사용하기</Button> :
																<div>이미 사용되었습니다.</div>
														}
													</TableCell>
													<TableCell>
														<div>
															<div>사용 일자 : {product.use_datetime}</div>
															<div>사용 코드 : {product.use_code}</div>
														</div>
													</TableCell>
												</TableRow>
											);
										})
									}
								</TableBody>
							</Table>
						</TableContainer>
					}
				</div>
			</div>
		</div>
	);
}

export default MypagePay;