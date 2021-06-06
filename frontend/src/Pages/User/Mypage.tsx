import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Button, TextField, TableBody, TableRow, TableCell, TableHead, Table, TableContainer } from '@material-ui/core';
import { ModalComponent, PageTitle } from '../../Components';
import "../../scss/pages/mypage.scss";

import axios from 'axios';
import { SERVER_URL } from '../../CommonVariable';
import { errorHandler } from '../../Main/ErrorHandler';
import { useTokenState } from '../../Main/TokenModel';
import { useUserState } from '../../Main/UserModel';
import { useHistory } from 'react-router-dom';
import { MypageUserType, MypagePointType } from '../../Main/Type';
import { MypageBook, MypagePay, MypageMovie, MypageInfo, MypageAsk } from '.';
import { getDateString, getDateStringFromDate } from '../../Function';

const Mypage = () => {
	const userId = useUserState();
	const AUTH_TOKEN = useTokenState();
	const history = useHistory();
	const [mode, setMode] = useState<number>(0); // 0 : 결제내역조회, 1 : 내가 본 영화, 2 : 1:1문의, 3 : 정보 관리

	const [userInfo, setUserInfo] = useState<MypageUserType | undefined>(undefined); // user 전체 정보
	const [point, setPoint] = useState<MypagePointType[] | undefined>(undefined); // 포인트 내역 정보
	const [startDate, setStartDate] = useState<string>(getDateStringFromDate(new Date()));

	const [openPointModal, setOpenPointModal] = useState<boolean>(false);

	useEffect(() => { // 로그인 된 유저만 마이페이지 가능, 유저 정보 받아오기
		// if (userId === undefined) {
		// 	alert("로그인 후 이용 가능합니다.")
		// 	history.push("/login");
		// }
		fetchUserInfo();
	}, []);

	const handleModeChange = (e: any, newValue: number) => {
		setMode(newValue);
	}

	const fetchUserInfo = () => {
		if (!userId)
			return;
		axios.get(`${SERVER_URL}/user/${userId}`, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				setUserInfo(res.data);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	// 포인트 내역 조회 모달
	useEffect(() => {
		fetchPointList();
	}, [startDate]);

	const fetchPointList = () => {
		if (!userId)
			return;
		axios.get(`${SERVER_URL}/point/${userId}/${startDate}`, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		})
			.then((res) => {
				if (!res.data || !res.data.point)
					return;
				setPoint(res.data.point);
			})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const handlePointModal = () => {
		setOpenPointModal(true);
		fetchPointList();
	}

	return (
		<div>
			<PageTitle
				title="마이페이지"
				isButtonVisible={false}
			/>
			{
				userInfo ?
					<div className="mypage-con">
						<div className="pointer-con">
							<div>
								등급 : {userInfo?.user_type}
							</div>
							<div>
								현재 포인트 : {userInfo?.curr_point}포인트
							</div>
							<div>
								누적 포인트 : {userInfo?.accu_point}포인트
							</div>
							<Button variant="outlined" color="primary" onClick={handlePointModal}>포인트 내역 조회</Button>
						</div>
						<Tabs
							value={mode}
							onChange={handleModeChange}
							className="mypage-tab"
							indicatorColor="primary"
						>
							<Tab label="예매내역조회" />
							<Tab label="결제내역조회" />
							<Tab label="내가 본 영화" />
							<Tab label="1:1 문의" />
							<Tab label="정보 관리" />
						</Tabs>
						<div className="content-con">
							<div
								role="tabpanel"
								hidden={mode !== 0}
							>
								<MypageBook
									mode={mode}
								/>
							</div>
							<div
								role="tabpanel"
								hidden={mode !== 1}
							>
								<MypagePay
									mode={mode}
								/>
							</div>
							<div
								role="tabpanel"
								hidden={mode !== 2}
							>
								<MypageMovie
									mode={mode}
								/>
							</div>
							<div
								role="tabpanel"
								hidden={mode !== 3}
							>
								<MypageAsk
									mode={mode}
								/>
							</div>
							<div
								role="tabpanel"
								hidden={mode !== 4}
							>
								<MypageInfo
									mode={mode}
									userInfo={userInfo}
									fetchUserInfo={fetchUserInfo}
								/>
							</div>
						</div>
					</div>
					: <div>정보를 불러오는 중입니다.</div>
			}
			<ModalComponent
				open={openPointModal}
				setOpen={setOpenPointModal}
				title="포인트 내역 조회"
			>
				<TextField type="date" label="조회 시작 일자" value={getDateString(startDate)} onChange={(e: any) => { setStartDate(e.target.value.split("-").join("")) }} />
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>일자</TableCell>
								<TableCell>타입</TableCell>
								<TableCell>포인트</TableCell>
								<TableCell>메시지</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								point &&
								point.map((p) => (
									<TableRow key={p.poin_id}>
										<TableCell>{p.poin_datetime}</TableCell>
										<TableCell>{p.poin_type}</TableCell>
										<TableCell>{p.poin_amount}</TableCell>
										<TableCell>{p.message}</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
			</ModalComponent>
		</div>
	);
}

export default Mypage;