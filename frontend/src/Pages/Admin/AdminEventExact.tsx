import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EventExactType } from '../../Main/Type';

import axios from 'axios';
import { SERVER_URL } from '../../CommonVariable';
import { errorHandler } from '../../Main/ErrorHandler';
import { Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useTokenState } from '../../Main/TokenModel';

import "../../scss/pages/adminevent.scss";

interface MatchParams {
	event_id: string
}
import { PageTitle } from '../../Components';

const AdminEventExact: React.FunctionComponent<RouteComponentProps<MatchParams>> = ({ match }) => {
	const AUTH_TOKEN = useTokenState();
	const history = useHistory();
	const [Event, setEvent] = useState<EventExactType | undefined>(undefined);

	useEffect(() => {
		fetchEventExact();
	}, []);

	const fetchEventExact = () => {
		axios.get(`${SERVER_URL}/event/${match.params.event_id}`, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		}).then((res) => {
			if (!res.data)
				return;
			setEvent(res.data);
		})
			.catch((e) => {
				errorHandler(e, true);
			});
	}
	
	/** 수정 */
	const [title, setTitle] =useState<string>("");
	const [contents, setContents] =useState<string>("");

	useEffect(()=> {
		if(!Event)
			return;
		setTitle(Event.event_title);
		setContents(Event.event_contents);
	}, [Event]);

	const updateEvent = () => {
		axios.put(`${SERVER_URL}/event/update`,{
			"event_id" : Number(match.params.event_id), //2,
			"event_title" : title,//"2021년 6월 둘째주 휴무 일정",
			"event_contents" : contents//"2021년 6월 둘째주 목요일 (10일)은 영화관 보수공사로 인해 휴무입니다. \n 이용에 불편을 드려서 죄송합니다."
		}, {
			headers: {
				TOKEN: AUTH_TOKEN
			}
		}).then((res) => {
			alert("이벤트가 정상적으로 수정되었습니다.");
			fetchEventExact();
		})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	const deleteEvent = () => {
		axios.delete(`${SERVER_URL}/event/delete/${match.params.event_id}`,{
			headers: {
				TOKEN: AUTH_TOKEN
			}
		}).then((res) => {
			alert("이벤트가 정상적으로 삭제되었습니다.");
			history.push("/admin/event");
		})
			.catch((e) => {
				errorHandler(e, true);
			});
	}

	return (
		<>
			<PageTitle
				title="이벤트 세부"
				isButtonVisible={true}
			/>
			<div className="event-wrap">
				<div className="modify-con">
					<Button variant="outlined" color="primary" onClick={updateEvent}>수정하기</Button>
					<Button variant="outlined" color="secondary" onClick={deleteEvent}>삭제하기</Button>
				</div>
				<div>
					{
						Event ?
							<div className="event-con">
								<Table>
									<TableHead>
										<TableRow>
											<TableCell className="table-title">이벤트 제목</TableCell>
										</TableRow>
									</TableHead>
									<TableBody className="table-body">
										<TableRow key={Event.event_id}>
											<TableCell className="table-content">
												<TextField
													className="title-input"
													variant="outlined"
													placeholder="제목을 입력하세요."
													inputProps={{ maxLength: 50 }}
													label="이벤트 제목"
													value={title}
													onChange={(e:any) => setTitle(e.target.value)}
												/>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								<div className="event-content">
									<TextField
										label="이벤트 내용"
										placeholder="내용을 입력하세요."
										InputLabelProps={{shrink:true}}
										variant="outlined"
										inputProps={{ maxLength: 1000 }}
										value={contents}
										onChange={(e:any)=> setContents(e.target.value)}
										multiline={true}
										rows={10}
									/>
								</div>
							</div>
							: "데이터를 불러오는 중입니다."
					}
				</div>
			</div>
		</>
	);
}

export default AdminEventExact;