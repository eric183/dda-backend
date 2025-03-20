import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('预约管理')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: '创建预约' })
  @ApiResponse({ status: 200, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 404, description: '教练或用户不存在' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: '查询预约列表' })
  @ApiQuery({ name: 'userId', required: false, description: '用户ID' })
  @ApiQuery({ name: 'coachId', required: false, description: '教练ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: '预约状态',
    enum: AppointmentStatus,
  })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(
    @Query('userId') userId?: string,
    @Query('coachId') coachId?: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentService.findAll(
      userId ? parseInt(userId) : undefined,
      coachId ? parseInt(coachId) : undefined,
      status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '查询预约详情' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: '确认预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '确认成功' })
  @ApiResponse({ status: 400, description: '只有待确认的预约可以被确认' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.confirm(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: '取消预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiQuery({ name: 'reason', required: false, description: '取消原因' })
  @ApiResponse({ status: 200, description: '取消成功' })
  @ApiResponse({ status: 400, description: '已完成的预约不能取消' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Query('reason') reason?: string,
  ) {
    return this.appointmentService.cancel(id, reason);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: '完成预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '标记完成成功' })
  @ApiResponse({ status: 400, description: '只有已确认的预约可以被标记为完成' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.complete(id);
  }
}
