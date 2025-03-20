import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoachService } from './coach.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';

@ApiTags('coaches')
@Controller('coaches')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  @ApiOperation({ summary: '创建教练' })
  @ApiResponse({ status: 201, description: '教练创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get('checkCoachStatus')
  @ApiOperation({ summary: '检查教练状态' })
  @ApiParam({ name: 'unionId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功获取教练状态' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  checkCoachStatus(@Query('unionId') unionId: string) {}

  // 获取在职的以通过审核的教练列表
  @Get('list')
  @ApiOperation({ summary: '获取在职的以通过审核的教练列表' })
  @ApiResponse({ status: 200, description: '成功获取教练列表' })
  getCoachList() {
    return this.coachService.getCoachList();
  }

  @Get('byUnionId')
  @ApiOperation({ summary: '根据unionId获取教练信息' })
  @ApiParam({ name: 'unionId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功获取教练信息' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  getCoachByUnionId(@Query('unionId') unionId: string) {
    return this.coachService.getCoachByUnionId(unionId);
  }

  @Get('pending')
  @ApiOperation({ summary: '获取待审批的教练列表' })
  @ApiResponse({ status: 200, description: '成功获取待审批教练列表' })
  findPendingCoaches() {
    return this.coachService.findPendingCoaches();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '根据用户ID获取教练信息' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功获取教练信息' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  findByUserId(@Param('userId') userId: string) {
    return this.coachService.findByUserId(+userId);
  }

  @Get()
  @ApiOperation({ summary: '获取所有教练列表' })
  @ApiResponse({ status: 200, description: '成功获取教练列表' })
  findAll() {
    return this.coachService.findAll();
  }

  // // 用户预约教练
  // @Post('user/appointment')
  // @ApiOperation({ summary: '用户预约教练' })
  // @ApiResponse({ status: 200, description: '成功预约教练' })
  // @ApiResponse({ status: 400, description: '预约失败' })
  // userAppointment(@Body() body: any) {
  //   return this.coachService.userAppointment(body);
  // }
  @Get(':id')
  @ApiOperation({ summary: '获取指定ID的教练信息' })
  @ApiParam({ name: 'id', description: '教练ID' })
  @ApiResponse({ status: 200, description: '成功获取教练信息' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  findOne(@Param('id') id: string) {
    return this.coachService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新教练信息' })
  @ApiParam({ name: 'id', description: '教练ID' })
  @ApiResponse({ status: 200, description: '教练信息更新成功' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.update(+id, updateCoachDto);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '审批通过教练申请' })
  @ApiParam({ name: 'id', description: '教练ID' })
  @ApiQuery({ name: 'approverId', description: '审批人ID' })
  @ApiResponse({ status: 200, description: '教练申请审批通过' })
  @ApiResponse({ status: 400, description: '教练不是待审批状态' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  approveCoach(
    @Param('id') id: string,
    @Query('approverId') approverId: string,
  ) {
    return this.coachService.approveCoach(+id, +approverId);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '拒绝教练申请' })
  @ApiParam({ name: 'id', description: '教练ID' })
  @ApiQuery({ name: 'approverId', description: '审批人ID' })
  @ApiQuery({ name: 'reason', description: '拒绝原因' })
  @ApiResponse({ status: 200, description: '教练申请已拒绝' })
  @ApiResponse({ status: 400, description: '教练不是待审批状态' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  rejectCoach(
    @Param('id') id: string,
    @Query('approverId') approverId: string,
    @Query('reason') reason: string,
  ) {
    return this.coachService.rejectCoach(+id, +approverId, reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除教练' })
  @ApiParam({ name: 'id', description: '教练ID' })
  @ApiResponse({ status: 200, description: '教练删除成功' })
  @ApiResponse({ status: 404, description: '教练不存在' })
  remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}
